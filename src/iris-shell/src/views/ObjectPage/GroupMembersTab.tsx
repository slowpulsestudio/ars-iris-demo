import { useMemo, useState } from 'react';
import { Hub, Loupe } from '@lucasmarkes/hairline/react';
import { ARSAddMemberModal, ARSFilterArea, ARSGroupTable, ARSTableToolbar, EmptyState, type ARSGroupTableRow } from '@ars';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { SegmentedControl, type SegmentedItem } from '../../components/SegmentedControl/SegmentedControl.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { getGroupProps, saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { groupMemberOf, groupMembers, nearbyObjects } from '../../lib/groupMembers.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { renderArsFilterTag } from '../ListFilters/arsFilterTag.js';
import { DIRECTORY_OBJECT_FIELDS } from './directoryObjectFields.js';
import { MEMBERSHIPS_PAGE_SIZE, MEMBERSHIPS_SEARCH, TABLE_SETTINGS_TOAST } from './membershipsTab.js';
import styles from './GroupMembersTab.module.css';

const MODAL_PAGE_SIZE = 10;

type View = 'all' | 'members' | 'members-of';

/** The view switch (Segmented control 167:8053). Figma shows Members selected, so the tab opens on it. */
const VIEWS: SegmentedItem[] = [
  { value: 'all', label: 'All', icon: 'UsersFour' },
  { value: 'members', label: 'Members', icon: 'Users' },
  { value: 'members-of', label: 'Members Of', icon: 'UserGear' },
];

const TABLE_LABEL: Record<View, string> = { all: 'Memberships', members: 'Members', 'members-of': 'Members of' };

const EMPTY_MESSAGE: Record<View, string> = {
  all: 'This group has no members and is not a member of any group.',
  members: 'This group has no members.',
  'members-of': 'This group is not a member of any group.',
};

const toRow = (o: DirectoryObject): ARSGroupTableRow => ({
  id: o.id,
  name: o.name,
  objectType: OBJECT_TYPE_META[o.type].label,
  description: o.description,
  objectId: o.id,
  href: `#/tree/${o.parentId}/${o.id}`,
  icon: OBJECT_TYPE_META[o.type].icon,
});

export interface GroupMembersTabProps {
  group: DirectoryObject;
  /** The folder the group is in; its objects and those of the folders beside it stand in for members. */
  nodeId: string;
}

/**
 * GroupMembersTab — the Memberships tab (ARS_Group_Members_Content, ARS_WebUI2_Groups 167:7662): All, Members
 * and Members Of, a search, the memberships table with a remove button on each row, paging and the Add Member
 * modal. The directory data has no memberships, so they are picked from the objects near the group.
 */
export function GroupMembersTab({ group, nodeId }: GroupMembersTabProps) {
  const { getSiblings } = useDirectory();
  const props = useGroupProps(group);
  // The view, the ticked rows, the Add Member dialog and its chosen objects live in the address
  // (?tab=memberships&view=members-of&select=a,b&dialog=add-member&pick=c).
  const [viewParam, setViewParam] = useHashParam('view');
  const view: View = viewParam === 'all' || viewParam === 'members-of' ? viewParam : 'members';
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSet, setSelectedSet] = useHashSelection();
  const selected = useMemo(() => [...selectedSet], [selectedSet]);
  const setSelected = (ids: string[]) => setSelectedSet(new Set(ids));
  const [dialog] = useHashParam('dialog');
  const addOpen = dialog === 'add-member';
  const [pickParam, setPickParam] = useHashParam('pick');
  const addSelected = useMemo(() => (pickParam ? pickParam.split(',').filter(Boolean) : []), [pickParam]);
  const setAddSelected = (ids: string[]) => setPickParam(ids.length ? ids.join(',') : null);
  const [addQuery, setAddQuery] = useState('');
  const [addPage, setAddPage] = useState(1);

  const pool = useMemo(() => nearbyObjects(nodeId, getSiblings), [nodeId, getSiblings]);
  const members = useMemo(() => groupMembers(group, pool, props), [group, pool, props]);
  const memberOf = useMemo(() => groupMemberOf(group, pool, members, props), [group, pool, members, props]);
  const memberIds = useMemo(() => new Set(members.map((o) => o.id)), [members]);

  const rows = useMemo(() => {
    const list = view === 'members' ? members : view === 'members-of' ? memberOf : [...members, ...memberOf];
    const q = query.trim().toLowerCase();
    return list.filter((o) => !q || [o.name, o.description, o.id].some((v) => v.toLowerCase().includes(q))).map(toRow);
  }, [view, members, memberOf, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / MEMBERSHIPS_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * MEMBERSHIPS_PAGE_SIZE, safePage * MEMBERSHIPS_PAGE_SIZE);

  const available = useMemo(
    () => pool.filter((o) => o.id !== group.id && !memberIds.has(o.id)),
    [pool, group.id, memberIds],
  );
  // The modal's filter is the ARS filter area (Figma Modal 4145:59111).
  const af = useAdvancedFilter(available, DIRECTORY_OBJECT_FIELDS, 'bar', { renderPill: renderArsFilterTag, inlinePills: true });
  const candidates = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    return af.filtered.filter((o) => !q || [o.name, o.description, o.id].some((v) => v.toLowerCase().includes(q)));
  }, [af.filtered, addQuery]);
  const addPageCount = Math.max(1, Math.ceil(candidates.length / MODAL_PAGE_SIZE));
  const addSafePage = Math.min(addPage, addPageCount);

  const openAdd = () => {
    setAddQuery('');
    setAddPage(1);
    setHashParams({ dialog: 'add-member', pick: null });
  };

  const closeAdd = () => setHashParams({ dialog: null, pick: null });

  const saveAdd = () => {
    const current = getGroupProps(group);
    saveGroupProps(group.id, {
      addedMembers: [...current.addedMembers, ...addSelected],
      // A member removed earlier and added again shows again.
      removedMembers: current.removedMembers.filter((id) => !addSelected.includes(id)),
    });
    setHashParams({ dialog: null, pick: null, view: null });
    showToast(
      addSelected.length === 1 ? 'Member added successfully' : `${addSelected.length} members added successfully`,
      { supportingText: `Added to group ${group.name}.` },
    );
  };

  // Figma's remove button on each row (167:8103) doesn't say what it does: it takes the member out of the
  // group (or the group out of the other group in Members Of), with Undo on the toast.
  const remove = (row: ARSGroupTableRow) => {
    setSelected(selected.filter((id) => id !== row.id));
    if (memberIds.has(row.id)) {
      saveGroupProps(group.id, { removedMembers: [...getGroupProps(group).removedMembers, row.id] });
      showToast(`${row.name} removed from ${group.name}.`, {
        onUndo: () =>
          saveGroupProps(group.id, { removedMembers: getGroupProps(group).removedMembers.filter((id) => id !== row.id) }),
      });
      return;
    }
    saveGroupProps(group.id, { leftGroups: [...getGroupProps(group).leftGroups, row.id] });
    showToast(`${group.name} removed from ${row.name}.`, {
      onUndo: () => saveGroupProps(group.id, { leftGroups: getGroupProps(group).leftGroups.filter((id) => id !== row.id) }),
    });
  };

  const switchView = (next: string) => {
    setViewParam(next === 'members' ? null : next);
    setPage(1);
    setSelected([]);
  };

  const search = query.trim();
  const empty =
    rows.length === 0 &&
    (search ? (
      <EmptyState
        className={styles.empty}
        figure={Loupe}
        message={`No memberships match “${search}”.`}
        actionLabel="Clear search"
        actionIcon="XCircle"
        onAction={() => setQuery('')}
      />
    ) : (
      <EmptyState
        className={styles.empty}
        figure={Hub}
        message={EMPTY_MESSAGE[view]}
        actionLabel={view === 'members-of' ? undefined : 'Add members'}
        onAction={openAdd}
      />
    ));

  return (
    <div className={styles.root}>
      <ARSTableToolbar
        variant="Basic"
        hideFilter
        leading={
          <SegmentedControl layout="inline" ariaLabel="Memberships view" items={VIEWS} value={view} onChange={switchView} />
        }
        searchPlaceholder={MEMBERSHIPS_SEARCH}
        actionLabel="Add members"
        onAction={openAdd}
        search={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
      />
      {empty || (
        <>
          <ARSGroupTable
            variant="Memberships"
            ariaLabel={TABLE_LABEL[view]}
            rows={pageRows}
            selectedIds={selected}
            onSelectedIdsChange={setSelected}
            onRemove={remove}
            onSettings={() => showToast(TABLE_SETTINGS_TOAST)}
          />
          <div className={styles.pagination}>
            <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} ariaLabel={`${TABLE_LABEL[view]} pages`} />
          </div>
        </>
      )}
      <ModalOverlay open={addOpen} onClose={closeAdd} label="Add members">
        <ARSAddMemberModal
          title="Add members"
          found={candidates.length}
          rows={candidates.slice((addSafePage - 1) * MODAL_PAGE_SIZE, addSafePage * MODAL_PAGE_SIZE).map((o) => ({
            id: o.id,
            name: o.name,
            objectType: OBJECT_TYPE_META[o.type].label,
            description: o.description,
          }))}
          selectedIds={addSelected}
          onSelectedIdsChange={setAddSelected}
          selectedItems={addSelected.map((id) => ({ id, label: pool.find((o) => o.id === id)?.name ?? id }))}
          search={addQuery}
          onSearchChange={(value) => {
            setAddQuery(value);
            setAddPage(1);
          }}
          onFilter={af.onFilter}
          filterCount={af.filterCount}
          filters={
            af.bar && (
              <ARSFilterArea onAdd={af.onFilter} onClear={af.clear}>
                {af.bar}
              </ARSFilterArea>
            )
          }
          empty={af.emptyWhen(candidates.length)}
          pagination={{
            page: addSafePage,
            pageCount: addPageCount,
            onPageChange: setAddPage,
            pageSize: MODAL_PAGE_SIZE,
            pageSizeOptions: [MODAL_PAGE_SIZE],
          }}
          onClose={closeAdd}
          onCancel={closeAdd}
          onSave={saveAdd}
        />
      </ModalOverlay>
      {af.elements}
    </div>
  );
}
