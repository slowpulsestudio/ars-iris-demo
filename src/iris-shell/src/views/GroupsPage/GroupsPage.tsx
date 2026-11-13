import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { ARSActionBar, ARSGroupActions, ARSTableGroups } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { cx } from '../../lib/cx.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import type { DirectoryNodeView, DirectoryObject } from '../../lib/directoryData.js';
import { DEPARTMENT_NAMES, ENTRA_TENANTS } from '../../lib/directoryData.js';
import { inDirectories, useDirectoryFilter } from '../../lib/directoryFilter.js';
import type { FilterFieldDef } from '../../lib/advancedFilter.js';
import { getGroupProps } from '../../lib/groupDetailsStore.js';
import { canMoveItem, moveEntries, type MoveItem } from '../../lib/moveObjects.js';
import { navigate } from '../../lib/router.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { Menu } from '../../components/Menu/Menu.js';
import { CreateGroupModal } from './CreateGroupModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { GroupDialogs } from '../ObjectModals/GroupDialogs.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { NoDirectoriesSelected } from '../NoDirectoriesSelected/NoDirectoriesSelected.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import screen from '../ARSScreen/ARSScreen.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];
/** The row menu's actions that open a dialog over the list, named after the action (?dialog=rename&target=id). */
const ROW_DIALOGS = ['Rename', 'Move', 'Copy', 'Deprovision', 'Delete'];
// Figma's sample tag pairs (ARS_Table_Groups) for groups that aren't named "[Department] [Role]";
// the directory data has no tags, so those groups take them in turn.
const TAG_PAIRS = [
  ['Security', 'Compliance'],
  ['Marketing', 'Strategy'],
  ['Engineering', 'DevOps'],
  ['Security', 'Administrator'],
  ['Sales', 'Revenue'],
  ['Support', 'Services'],
  ['Product', 'Strategy'],
  ['HR', 'Operations'],
  ['IT', 'Infrastructure'],
  ['Finance', 'Compliance'],
  ['Leadership', 'Strategy'],
  ['QA', 'Engineering'],
  ['Analytics', 'Data'],
  ['Cloud', 'Operations'],
  ['Legal', 'Compliance'],
];

function nodeIds(nodes: DirectoryNodeView[]): string[] {
  return nodes.flatMap((n) => [n.id, ...nodeIds(n.children)]);
}

/**
 * GroupsPage — the Groups list (ARS_Table_Groups 158:33464): every group in
 * the directory with its type, description, tags and folder. Rows open the group page.
 */
export function GroupsPage() {
  const directory = useDirectory();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useHashSelection();
  // The New AD Group and New Entra Distribution Group forms live in the address (?dialog=new-group,
  // ?dialog=new-entra-group), as do a row's actions (?dialog=move&target=id) and the bar's Move (?dialog=move&target=a,b).
  const [dialog] = useHashParam('dialog');
  const [targetParam] = useHashParam('target');
  const createKind = dialog === 'new-group' ? 'AD' : dialog === 'new-entra-group' ? 'Entra' : null;
  const createMenu = useAnchoredMenu();
  const closeDialog = () => setHashParams({ dialog: null, target: null });
  const [removedTags, setRemovedTags] = useState<Map<string, Set<string>>>(() => new Map());
  const [rowGroup, setRowGroup] = useState<DirectoryObject | null>(null);
  const rowMenu = useAnchoredMenu();
  const [showSelected, setShowSelected] = useState(false);
  const { setAiOpen, setAiContext } = useAppShell();

  // Only groups inside a directory (under Managed Directories); the Access Templates and Managed Units folders aren't directories.
  const groups = useMemo<DirectoryObject[]>(
    () =>
      nodeIds(directory.nodeTree)
        .filter((id) => directory.getPath(id)[0]?.id === 'managed-directories')
        .flatMap((id) => directory.getSiblings(id).filter((o) => o.type === 'group')),
    [directory],
  );
  const tagsFor = useMemo(() => {
    const index = new Map(groups.map((g, i) => [g.id, i]));
    const byId = new Map(groups.map((g) => [g.id, g]));
    const topics = [...new Set(TAG_PAIRS.map((p) => p[1]))];
    return (id: string) => {
      const i = index.get(id) ?? 0;
      // A "[Department] [Role]" group is tagged with its department plus a topic; other names use Figma's pairs.
      const first = byId.get(id)?.name.split(' ')[0] ?? '';
      const known = DEPARTMENT_NAMES.has(first);
      const topic = topics.filter((t) => t !== first)[(i * 5) % (topics.length - 1)];
      const pair = known ? [first, topic] : TAG_PAIRS[i % TAG_PAIRS.length];
      return pair.filter((t) => !removedTags.get(id)?.has(t));
    };
  }, [groups, removedTags]);

  // Figma's Directory column: "AD1\Groups" (directory, then folders) or "Entra1" (the directory only).
  const describe = useCallback(
    (g: DirectoryObject) => {
      const path = directory.getPath(g.parentId);
      const entra = path[1]?.id === 'entra-directories';
      const fromDirectory = path.slice(2).map((p) => p.name);
      return {
        groupType: entra ? 'O365Group' : `${getGroupProps(g).type}Group`,
        directory: (entra ? fromDirectory.slice(0, 1) : fromDirectory).join('\\'),
      };
    },
    [directory],
  );

  const [directories] = useDirectoryFilter();
  const inScope = useMemo(
    () => groups.filter((g) => inDirectories(directories, describe(g).directory)),
    [groups, directories, describe],
  );
  // The list's columns, as the Advanced filter's fields.
  const groupFields = useMemo<FilterFieldDef<DirectoryObject>[]>(
    () => [
      { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (g) => g.name },
      { id: 'Group type', label: 'Group type', icon: 'UserCircleCheck', get: (g) => describe(g).groupType, list: true, category: 'Groups' },
      { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (g) => g.description },
      { id: 'Tags', label: 'Tags', icon: 'Tag', get: (g) => tagsFor(g.id), list: true },
      { id: 'Directory', label: 'Directory', icon: 'BuildingOffice', get: (g) => describe(g).directory, list: true },
    ],
    [describe, tagsFor],
  );
  const gf = useAdvancedFilter(inScope, groupFields, 'panel', { viewName: 'Groups' });
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matching = gf.filtered.filter((g) => !q || [g.name, g.description].some((v) => v.toLowerCase().includes(q)));
    return showSelected ? matching.filter((g) => selected.has(g.id)) : matching;
  }, [gf.filtered, query, showSelected, selected]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const hrefFor = (g: DirectoryObject) => `#/tree/${g.parentId}/${g.id}`;
  const moveItemFor = (g: DirectoryObject): MoveItem => ({ id: g.id, nodeId: g.parentId, isContainer: false });
  const targetIds = targetParam ? targetParam.split(',') : [];
  const targets = groups.filter((g) => targetIds.includes(g.id));
  const target = targets.length === 1 ? targets[0] : null;
  const moveTargets = dialog === 'move' && targets.length > 0 ? targets : null;
  const deleteTarget = dialog === 'delete' ? target : null;
  const isEntra = (g: DirectoryObject) => describe(g).groupType === 'O365Group';

  // A row's "…" opens the group's actions from the written requirements ("Object Actions" 64:6801;
  // requirements board: AD group 453:2930, Entra group 531:1408 without Move).
  const onRowAction = (label: string) => {
    const g = rowGroup;
    if (!g) return;
    if (label === 'Properties') navigate(hrefFor(g));
    else if (ROW_DIALOGS.includes(label)) setHashParams({ dialog: label.toLowerCase(), target: g.id });
  };

  // The bulk action bar, wired as on the Users list.
  const selectedGroups = groups.filter((g) => selected.has(g.id));
  const onBarAction = (label: string, e: MouseEvent<HTMLButtonElement>) => {
    const only = selectedGroups.length === 1 ? selectedGroups[0] : null;
    if (label === 'Select all') setSelected(new Set(inScope.map((g) => g.id)));
    if (label === 'Move') setHashParams({ dialog: 'move', target: selectedGroups.map((g) => g.id).join(',') });
    if (label === 'Properties' && only) navigate(hrefFor(only));
    if (label === 'More actions' && only) {
      setRowGroup(only);
      rowMenu.openAt(e);
    }
    if (label === 'Ask AI') {
      setAiContext(selectedGroups.map((g) => ({ kind: 'group' as const, id: g.id, label: g.name })));
      setAiOpen(true);
    }
  };

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Groups' }]}>
      <ARSTableGroups
        className={cx(screen.screen, selected.size > 0 && screen.withBar)}
        header={{ title: 'Groups', icon: 'UsersThree' }}
        empty={directories.size === 0 ? <NoDirectoriesSelected /> : gf.emptyWhen(rows.length)}
        toolbar={{
          // A split Create, as the designer asked (Figma draws a plain "+ Create", 160:9037); both halves open the
          // AD group or Entra group choice.
          variant: 'Split',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          actionLabel: 'Create',
          onAction: createMenu.openAt,
          onActionMenu: createMenu.openAt,
          onFilter: gf.onFilter,
          filterCount: gf.filterCount,
          filterPressed: gf.filterPressed,
        }}
        rows={pageRows.map((g) => ({
          id: g.id,
          name: g.name,
          href: `#/tree/${g.parentId}/${g.id}`,
          description: g.description,
          tags: tagsFor(g.id),
          ...describe(g),
        }))}
        onRemoveTag={(id, tag) =>
          setRemovedTags((prev) => new Map(prev).set(id, new Set([...(prev.get(id) ?? []), tag])))
        }
        selected={selected}
        onSelectionChange={setSelected}
        onMore={(id, e) => {
          setRowGroup(groups.find((g) => g.id === id) ?? null);
          rowMenu.openAt(e);
        }}
        pagination={{
          page: safePage,
          pageCount,
          onPageChange: setPage,
          pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
      />
      <Menu
        {...createMenu.menuProps}
        ariaLabel="Create group"
        items={[
          { kind: 'item', label: 'AD group', icon: 'UsersThree', onSelect: () => setHashParams({ dialog: 'new-group', target: null }) },
          { kind: 'item', label: 'Entra group', icon: 'UsersThree', onSelect: () => setHashParams({ dialog: 'new-entra-group', target: null }) },
        ]}
      />
      <CreateGroupModal
        open={createKind !== null}
        onClose={closeDialog}
        kind={createKind ?? 'AD'}
        // From the Groups list a new group goes in the first directory of its kind unless another folder is chosen.
        locationId={createKind === 'Entra' ? ENTRA_TENANTS[0].id : 'o1d-local'}
      />
      <ARSGroupActions
        {...rowMenu.menuProps}
        entra={rowGroup !== null && isEntra(rowGroup)}
        ariaLabel={`Actions for ${rowGroup?.name ?? 'group'}`}
        onAction={onRowAction}
      />
      <ARSActionBar
        variant={selectedGroups.length === 1 ? '2' : 'Default'}
        showDelete={selectedGroups.length !== 1}
        // Groups have no password; Entra groups have no Move (requirements board 531:1408).
        hiddenActions={selectedGroups.some(isEntra) ? ['Reset password', 'Move'] : ['Reset password']}
        open={selected.size > 0}
        selectedCount={selected.size}
        totalCount={inScope.length}
        showTotal
        showSelected={showSelected}
        onShowSelectedChange={setShowSelected}
        layout="inline"
        onAction={onBarAction}
        onDismiss={() => {
          setSelected(new Set());
          setShowSelected(false);
        }}
      />
      <MoveObjectSheet
        open={moveTargets !== null}
        onClose={closeDialog}
        objects={(moveTargets ?? []).map((g) => ({ id: g.id, name: g.name }))}
        objectType="Group"
        currentNodeId={moveTargets?.length === 1 ? moveTargets[0].parentId : null}
        canMoveTo={(destId) => (moveTargets ?? []).every((g) => canMoveItem(moveItemFor(g), destId))}
        onMove={(destId, objs) => {
          moveEntries(
            (moveTargets ?? [])
              .filter((g) => objs.some((o) => o.id === g.id))
              .map((g) => ({ item: moveItemFor(g), name: g.name, typeLabel: 'Group' })),
            destId,
            directory.getNodeName(destId) ?? 'the folder',
          );
          closeDialog();
        }}
      />
      {deleteTarget && (
        <DeleteObjectModal
          open
          onClose={closeDialog}
          objectClass="Group"
          name={deleteTarget.name}
          location={describe(deleteTarget).directory}
          onDeleted={() => {
            directory.removeObject(deleteTarget.parentId, deleteTarget.id);
            setSelected(new Set([...selected].filter((id) => id !== deleteTarget.id)));
          }}
        />
      )}
      {target && (
        <GroupDialogs
          dialog={dialog}
          group={target}
          nodeId={target.parentId}
          onClose={closeDialog}
          onRename={(name) =>
            directory.updateObject(target.parentId, target.id, {
              ...target,
              name,
              details: { ...target.details, displayName: name },
            })
          }
        />
      )}
    </AppShell>
  );
}
