import { useMemo, useState } from 'react';
import { ARSAddMemberModal, ARSFilterArea, ARSGroupTable, ARSTableToolbar, EmptyState, type ARSGroupTableRow } from '@ars';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { addUserMemberships, removeUserMembership, SAMPLE_GROUPS, useUserMemberships } from '../../lib/userMemberships.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { renderArsFilterTag } from '../ListFilters/arsFilterTag.js';
import { NAMED_OBJECT_FIELDS } from './namedObjectFields.js';
import { MEMBERSHIPS_PAGE_SIZE, MEMBERSHIPS_SEARCH, TABLE_SETTINGS_TOAST } from './membershipsTab.js';
import styles from './GroupMembersTab.module.css';

const MODAL_PAGE_SIZE = 10;

export interface UserMembershipsTabProps {
  userId: string;
  userName: string;
}

/**
 * UserMembershipsTab — a user's Memberships tab: the groups the user is a member of, laid out as the group's
 * Memberships tab (ARS_Group_Members_Content, ARS_WebUI2_Groups 167:7662) without the view switch, since a
 * user has no members. A search, the memberships table with a remove button on each row, paging and the Add
 * Member modal to pick more groups. The data is sample content.
 */
export function UserMembershipsTab({ userId, userName }: UserMembershipsTabProps) {
  const groups = useUserMemberships(userId);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // The ticked rows, the Add Member dialog and its chosen groups live in the address
  // (?tab=memberships&select=a,b&dialog=add-member&pick=c).
  const [selectedSet, setSelectedSet] = useHashSelection();
  const selected = useMemo(() => [...selectedSet], [selectedSet]);
  const [dialog] = useHashParam('dialog');
  const addOpen = dialog === 'add-member';
  const [pickParam, setPickParam] = useHashParam('pick');
  const addSelected = useMemo(() => (pickParam ? pickParam.split(',').filter(Boolean) : []), [pickParam]);
  const [addQuery, setAddQuery] = useState('');
  const [addPage, setAddPage] = useState(1);

  const rows = useMemo<ARSGroupTableRow[]>(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => !q || [g.name, g.description, g.objectId].some((v) => v.toLowerCase().includes(q)))
      .map((g) => ({
        id: g.id,
        name: g.name,
        objectType: 'Group',
        description: g.description,
        objectId: g.objectId,
        // The sample groups have no pages of their own, so a name opens the Groups list.
        href: '#/groups',
        icon: 'UsersThree',
      }));
  }, [groups, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / MEMBERSHIPS_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const available = useMemo(() => {
    const have = new Set(groups.map((g) => g.id));
    return SAMPLE_GROUPS.filter((g) => !have.has(g.id));
  }, [groups]);
  // The modal's filter is the ARS filter area (Figma Modal 4145:59111).
  const af = useAdvancedFilter(available, NAMED_OBJECT_FIELDS, 'bar', { renderPill: renderArsFilterTag, inlinePills: true });
  const candidates = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    return af.filtered.filter((g) => !q || [g.name, g.description].some((v) => v.toLowerCase().includes(q)));
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
    if (addSelected.length === 0) {
      closeAdd();
      return;
    }
    addUserMemberships(userId, addSelected);
    setHashParams({ dialog: null, pick: null });
    showToast(
      addSelected.length === 1 ? 'Member added successfully' : `${addSelected.length} members added successfully`,
      { supportingText: `Added ${userName} to ${addSelected.length === 1 ? 'the group' : 'the groups'}.` },
    );
  };

  // Figma's remove button (167:8103) doesn't say what it does: it takes the user out of the group, with Undo.
  const remove = (row: ARSGroupTableRow) => {
    setSelectedSet(new Set(selected.filter((id) => id !== row.id)));
    showToast(`${userName} removed from ${row.name}.`, { onUndo: removeUserMembership(userId, row.id) });
  };

  const search = query.trim();
  const empty =
    rows.length === 0 &&
    (search ? (
      <EmptyState
        className={styles.empty}
        message={`No memberships match “${search}”.`}
        actionLabel="Clear search"
        actionIcon="XCircle"
        onAction={() => setQuery('')}
      />
    ) : (
      <EmptyState
        className={styles.empty}
        message={`${userName} is not a member of any group.`}
        actionLabel="Add groups"
        onAction={openAdd}
      />
    ));

  return (
    <div className={styles.root}>
      <ARSTableToolbar
        variant="Basic"
        hideFilter
        searchPlaceholder={MEMBERSHIPS_SEARCH}
        actionLabel="Add groups"
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
            ariaLabel="Memberships"
            rows={rows.slice((safePage - 1) * MEMBERSHIPS_PAGE_SIZE, safePage * MEMBERSHIPS_PAGE_SIZE)}
            selectedIds={selected}
            onSelectedIdsChange={(ids) => setSelectedSet(new Set(ids))}
            onRemove={remove}
            onSettings={() => showToast(TABLE_SETTINGS_TOAST)}
          />
          <div className={styles.pagination}>
            <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} ariaLabel="Memberships pages" />
          </div>
        </>
      )}
      <ModalOverlay open={addOpen} onClose={closeAdd} label="Add groups">
        <ARSAddMemberModal
          title="Add groups"
          found={candidates.length}
          rows={candidates.slice((addSafePage - 1) * MODAL_PAGE_SIZE, addSafePage * MODAL_PAGE_SIZE).map((g) => ({
            id: g.id,
            name: g.name,
            objectType: 'Group',
            description: g.description,
          }))}
          selectedIds={addSelected}
          onSelectedIdsChange={(ids) => setPickParam(ids.length ? ids.join(',') : null)}
          selectedItems={addSelected.map((id) => ({ id, label: SAMPLE_GROUPS.find((g) => g.id === id)?.name ?? id }))}
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
