import { useCallback, useEffect, useMemo, useState, type DragEvent, type MouseEvent } from 'react';
import {
  ARSADRightClickTreeMenu,
  ARSADUserActions,
  ARSActionBar,
  ARSEmptyContent,
  ARSNewObjectMenu,
  ARSPageMenu,
  ARSTreeViewADContent,
} from '@ars';
import { NEW_OBJECT_MENU } from '@ars/components/ARSNewObjectMenu/ARSNewObjectMenu.js';
import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { cx } from '../../lib/cx.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { canMoveItem, moveEntries, type MoveEntry, type MoveItem } from '../../lib/moveObjects.js';
import { endObjectDrag, startObjectDrag } from '../../lib/objectDrag.js';
import { sampleDates, sampleTags, type FilterRow } from '../../lib/listFilters.js';
import { useListFilters } from '../ListFilters/useListFilters.js';
import { Button } from '../../components/Button/Button.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { ResetPasswordModal } from '../ObjectModals/ResetPasswordModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { setDragPreview } from './dragPreview.js';
import { type CreateGroupKind } from '../GroupsPage/CreateGroupModal.js';
import { ComingSoonModal } from '../ObjectModals/ComingSoonModal.js';
import { CreateOUModal } from '../OUPage/CreateOUModal.js';
import { removeNode } from '../../lib/directoryData.js';
import { CreateObjectModal, type CreateObjectResult } from '../UsersPage/CreateObjectModal/CreateObjectModal.js';
import {
  announceCreated,
  directoryObjectFromValues,
  objectTypeFromMenuLabel,
} from '../UsersPage/CreateObjectModal/createdObject.js';
import screen from '../ARSScreen/ARSScreen.module.css';
import styles from './TreeView.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];

/** Icon of each New object menu entry, by label. */
const NEW_OBJECT_ICONS = new Map(
  NEW_OBJECT_MENU.flatMap((row) => (row === 'divider' || !row.icon ? [] : [[row.label, row.icon] as const])),
);

/** The icon of the New object menu entry for an object type. */
function newObjectIconFor(type: string): string {
  for (const [label, icon] of NEW_OBJECT_ICONS) if (objectTypeFromMenuLabel(label) === type) return icon;
  return 'User';
}

/** Href for a row: containers drill in; leaves open detail. */
function hrefFor(obj: DirectoryObject): string {
  return obj.isContainer ? `#/tree/${obj.id}` : `#/tree/${obj.parentId}/${obj.id}`;
}

export interface TreeListPageProps {
  nodeId: string;
}

/**
 * TreeListPage — Directory Management, Tree view: the contents of a folder
 * (Tree_View_AD_Content) inside the shell's directory layout.
 */
export function TreeListPage({ nodeId }: TreeListPageProps) {
  const { isContainer, getChildren, getPath, getNodeName, getNodeIcon, addObject, removeObject } = useDirectory();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelectedSet] = useHashSelection();
  const setSelected = (next: Set<string> | ((s: Set<string>) => Set<string>)) =>
    setSelectedSet(typeof next === 'function' ? next(selected) : next);
  const [showSelected, setShowSelected] = useState(false);

  // The open dialog and what it is about live in the address
  // (?select=a,b&dialog=delete&target=a, or ?dialog=create&type=User).
  const [dialog] = useHashParam('dialog');
  const [targetParam] = useHashParam('target');
  const [typeParam] = useHashParam('type');
  const closeDialog = () => setHashParams({ dialog: null, target: null, type: null });
  const openDialog = (name: string, ids: string[] = []) =>
    setHashParams({ dialog: name, target: ids.length ? ids.join(',') : null, type: null });

  const [rowObject, setRowObject] = useState<DirectoryObject | null>(null);
  const rowMenu = useAnchoredMenu();
  // What the Filters menu sees of an object. Tags and dates are sample values; no list shows them.
  const toFilterRow = useCallback(
    (o: DirectoryObject): FilterRow => ({
      name: o.name,
      type: OBJECT_TYPE_META[o.type].label,
      tags: sampleTags(o.id),
      location: getNodeName(o.parentId) ?? '',
      ...sampleDates(o.id),
    }),
    [getNodeName],
  );
  const createMenu = useAnchoredMenu();
  const pageMenu = useAnchoredMenu();

  // Reset transient view state when the selected node changes. (The ticked rows are in the address,
  // which a move to another folder replaces.)
  useEffect(() => {
    setQuery('');
    setPage(1);
    setShowSelected(false);
  }, [nodeId]);

  const nodeName = getNodeName(nodeId);
  const known = isContainer(nodeId);

  const allRows = useMemo<DirectoryObject[]>(
    () => (known ? getChildren(nodeId) : []),
    [known, getChildren, nodeId],
  );

  // Figma: search covers this folder and the folders below it, not the ones above.
  const searching = query.trim() !== '';
  const pool = useMemo<DirectoryObject[]>(() => {
    if (!searching) return allRows;
    const below: DirectoryObject[] = [];
    const visit = (id: string) => {
      for (const o of getChildren(id)) {
        below.push(o);
        if (o.isContainer) visit(o.id);
      }
    };
    for (const o of allRows) if (o.isContainer) visit(o.id);
    return [...allRows, ...below];
  }, [searching, allRows, getChildren]);
  const lf = useListFilters(pool, toFilterRow);

  const targets = useMemo(() => {
    const ids = targetParam ? targetParam.split(',') : [];
    return pool.filter((o) => ids.includes(o.id));
  }, [pool, targetParam]);
  const resetTarget = dialog === 'reset-password' ? (targets[0] ?? null) : null;
  const deleteTarget = dialog === 'delete' ? (targets[0] ?? null) : null;
  const moveTargets = dialog === 'move' ? targets : null;
  const createTarget = dialog === 'create' && typeParam ? { type: typeParam, icon: newObjectIconFor(typeParam) } : null;
  const groupCreate: CreateGroupKind | null =
    dialog === 'new-group' ? (getPath(nodeId).some((n) => n.id === 'entra-directories') ? 'Entra' : 'AD') : null;
  const ouCreate = dialog === 'new-ou';

  const rows = useMemo<DirectoryObject[]>(() => {
    const q = query.trim().toLowerCase();
    const matching = q
      ? lf.filtered.filter((o) =>
          [o.name, OBJECT_TYPE_META[o.type].label, o.description].some((v) => v.toLowerCase().includes(q)),
        )
      : lf.filtered;
    return showSelected ? matching.filter((o) => selected.has(o.id)) : matching;
  }, [lf.filtered, query, showSelected, selected]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = useMemo<DirectoryObject[]>(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize],
  );

  // Changing the page size keeps the first visible row in view.
  const handlePageSizeChange = (nextSize: number) => {
    const firstVisibleIndex = (safePage - 1) * pageSize;
    setPageSize(nextSize);
    setPage(Math.floor(firstVisibleIndex / nextSize) + 1);
  };

  const toggleRowFavorite = (o: DirectoryObject) =>
    toggleFavorite({
      id: o.id,
      name: o.name,
      type: OBJECT_TYPE_META[o.type].label,
      description: o.description,
      href: hrefFor(o),
    });

  const onRowAction = (label: string) => {
    if (!rowObject) return;
    if (label === 'Reset Password') openDialog('reset-password', [rowObject.id]);
    if (label === 'Delete') openDialog('delete', [rowObject.id]);
    if (label === 'Move') openDialog('move', [rowObject.id]);
    if (label === 'View properties') navigate(hrefFor(rowObject).replace(/^#\/tree\/([^/]+)$/, `#/tree/${nodeId}/${rowObject.id}`));
    if (label === 'Add to Favorites') toggleRowFavorite(rowObject);
  };

  const onPageAction = (label: string) => {
    if (label === 'Add to Favorites') {
      toggleFavorite({ id: nodeId, name: nodeName ?? 'Directory', type: 'Folder', href: `#/tree/${nodeId}` });
    }
  };

  const openCreate = (label: string) => {
    const type = objectTypeFromMenuLabel(label);
    if (type === 'Group') {
      openDialog('new-group');
      return;
    }
    if (type === 'Organizational Unit') {
      openDialog('new-ou');
      return;
    }
    if (type) setHashParams({ dialog: 'create', type, target: null });
  };

  const selectedObjects = pool.filter((o) => selected.has(o.id));
  const onBarAction = (label: string, e: MouseEvent<HTMLButtonElement>) => {
    const only = selectedObjects.length === 1 ? selectedObjects[0] : null;
    if (label === 'Select all') setSelected(new Set(allRows.map((o) => o.id)));
    if (label === 'Reset password' && only) openDialog('reset-password', [only.id]);
    if (label === 'Delete' && only) openDialog('delete', [only.id]);
    if (label === 'Move') openDialog('move', selectedObjects.map((o) => o.id));
    if (label === 'More actions' && only) {
      setRowObject(only);
      rowMenu.openAt(e);
    }
  };

  const toMoveItem = (o: DirectoryObject): MoveItem => ({ id: o.id, nodeId: o.parentId || nodeId, isContainer: o.isContainer });
  const entryFor = (o: DirectoryObject): MoveEntry => ({
    item: toMoveItem(o),
    name: o.name,
    typeLabel: OBJECT_TYPE_META[o.type].label,
  });

  const onMoveObjects = (destId: string, objs: Array<{ id: string }>) => {
    const movable = (moveTargets ?? []).filter((o) => objs.some((x) => x.id === o.id));
    moveEntries(movable.map(entryFor), destId, getNodeName(destId) ?? 'the folder');
    closeDialog();
  };

  // Dragging a selected row drags the whole selection; any other row drags alone.
  const onRowDragStart = (id: string, e: DragEvent<HTMLElement>) => {
    const row = pool.find((o) => o.id === id);
    if (!row) return;
    const dragged = selected.has(id) ? selectedObjects : [row];
    startObjectDrag(dragged.map(entryFor), e);
    setDragPreview(e, row.isContainer ? 'Directory folder' : 'User', dragged.length > 1 ? `${dragged.length} objects` : row.name);
  };

  // Objects that moved away leave the selection.
  useEffect(() => {
    const ids = new Set(pool.map((o) => o.id));
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [pool]);

  const onCreated = (result: CreateObjectResult) => {
    if (!result.locationId) {
      announceCreated(result);
      return;
    }
    const object = directoryObjectFromValues(result, result.locationId);
    addObject(result.locationId, object);
    announceCreated(result, `#/tree/${result.locationId}/${object.id}`);
  };

  const breadcrumb = useMemo<Crumb[]>(() => {
    const path = getPath(nodeId);
    const crumbs: Crumb[] = [{ label: 'Directory Management' }];
    if (path.length > 1) crumbs.push({ label: '…' });
    const current = path[path.length - 1];
    crumbs.push({ label: current?.name ?? nodeName ?? 'Unknown' });
    return crumbs;
  }, [getPath, nodeId, nodeName]);

  if (!known) {
    return (
      <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Not found' }]}>
        <div className={styles.missing}>
          <h1 className={styles.missingTitle}>Directory not found</h1>
          <p className={styles.missingBody}>
            We couldn’t find a directory or folder with id <code>{nodeId}</code>.
          </p>
          <Button variant="secondary" onClick={() => navigate('#/tree')}>
            Back to Directory
          </Button>
        </div>
      </AppShell>
    );
  }

  const RowActions = rowObject && (rowObject.type === 'user' || rowObject.type === 'contact')
    ? ARSADUserActions
    : ARSADRightClickTreeMenu;
  const header = { title: nodeName ?? 'Directory', icon: getNodeIcon(nodeId), onMore: pageMenu.openAt };
  const toolbar = {
    variant: 'Split' as const,
    search: query,
    onSearchChange: (value: string) => {
      setQuery(value);
      setPage(1);
    },
    onFilter: lf.openFilters,
    onAction: createMenu.openAt,
    onActionMenu: createMenu.openAt,
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      {allRows.length === 0 ? (
        <ARSEmptyContent
          className={screen.screen}
          header={{ ...header, objectClass: 'Folder' }}
          toolbar={toolbar}
          message="This folder has no objects."
          actionLabel="Add object"
          onAction={() => setHashParams({ dialog: 'create', type: 'User', target: null })}
        />
      ) : (
        <ARSTreeViewADContent
          className={cx(screen.screen, selected.size > 0 && screen.withBar)}
          header={header}
          toolbar={toolbar}
          filters={lf.bar}
          rows={pageRows.map((o) => ({
            id: o.id,
            name: o.name,
            icon: OBJECT_TYPE_META[o.type].icon,
            href: hrefFor(o),
            objectType: OBJECT_TYPE_META[o.type].label,
            description: o.description,
          }))}
          selected={selected}
          onSelectionChange={setSelected}
          onMore={(id, e) => {
            setRowObject(pool.find((o) => o.id === id) ?? null);
            rowMenu.openAt(e);
          }}
          onRowDragStart={onRowDragStart}
          onRowDragEnd={endObjectDrag}
          pagination={{
            page: safePage,
            pageCount,
            onPageChange: setPage,
            pageSize,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      )}

      <RowActions {...rowMenu.menuProps} ariaLabel={`Actions for ${rowObject?.name ?? 'object'}`} onAction={onRowAction} />
      {lf.elements}
      <ARSPageMenu {...pageMenu.menuProps} onAction={onPageAction} />
      <ARSNewObjectMenu {...createMenu.menuProps} onAction={openCreate} />

      <ARSActionBar
        variant={selectedObjects.length === 1 ? '2' : 'Default'}
        showDelete={selectedObjects.length !== 1}
        open={selected.size > 0}
        selectedCount={selected.size}
        totalCount={allRows.length}
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

      {resetTarget && (
        <ResetPasswordModal
          open
          onClose={closeDialog}
          user={{ name: resetTarget.details.displayName || resetTarget.name }}
          location={nodeName ?? 'Directory'}
        />
      )}
      {deleteTarget && (
        <DeleteObjectModal
          open
          onClose={closeDialog}
          objectClass={OBJECT_TYPE_META[deleteTarget.type].label}
          name={deleteTarget.name}
          location={nodeName ?? 'Directory'}
          onDeleted={() => {
            if (deleteTarget.isContainer) removeNode(deleteTarget.id);
            else removeObject(deleteTarget.parentId || nodeId, deleteTarget.id);
            setSelected((s) => {
              const next = new Set(s);
              next.delete(deleteTarget.id);
              return next;
            });
          }}
        />
      )}
      <MoveObjectSheet
        open={moveTargets !== null}
        onClose={closeDialog}
        objects={(moveTargets ?? []).map((o) => ({ id: o.id, name: o.name }))}
        objectType={moveTargets?.[0] ? OBJECT_TYPE_META[moveTargets[0].type].label : undefined}
        currentNodeId={nodeId}
        canMoveTo={(destId) => (moveTargets ?? []).some((o) => canMoveItem(toMoveItem(o), destId))}
        onMove={onMoveObjects}
      />
      <CreateOUModal open={ouCreate} onClose={closeDialog} locationId={nodeId} />
      {groupCreate && (
        <ComingSoonModal
          open
          onClose={closeDialog}
          title={groupCreate === 'Entra' ? 'New Entra Distribution Group' : 'New AD Group'}
        />
      )}
      {createTarget && (
        <CreateObjectModal
          open
          onClose={closeDialog}
          objectType={createTarget.type}
          icon={createTarget.icon}
          locationId={nodeId}
          onCreate={onCreated}
        />
      )}
    </AppShell>
  );
}
