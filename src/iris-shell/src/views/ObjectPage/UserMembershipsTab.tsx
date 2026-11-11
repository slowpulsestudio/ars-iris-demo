import { useMemo, useState } from 'react';
import { ARSAddMemberModal, ARSGroupTable, ARSPagination, ARSTableToolbar } from '@ars';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { addUserMemberships, SAMPLE_GROUPS, useUserMemberships } from '../../lib/userMemberships.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import styles from './GroupMembersTab.module.css';

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];
const MODAL_PAGE_SIZE = 10;

export interface UserMembershipsTabProps {
  userId: string;
  userName: string;
}

/**
 * UserMembershipsTab — a user's Memberships tab: the groups the user is a
 * member of ("Groups object is member of", the Members Of page of
 * ARS_Group_Members_Content), with a search, the group table, paging and the
 * Add Member modal to pick more groups. The data is sample content.
 */
export function UserMembershipsTab({ userId, userName }: UserMembershipsTabProps) {
  const groups = useUserMemberships(userId);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
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

  const rows = useMemo(() => {
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
      }));
  }, [groups, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const candidates = useMemo(() => {
    const have = new Set(groups.map((g) => g.id));
    const q = addQuery.trim().toLowerCase();
    return SAMPLE_GROUPS.filter((g) => !have.has(g.id) && (!q || [g.name, g.description].some((v) => v.toLowerCase().includes(q))));
  }, [groups, addQuery]);
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

  return (
    <div className={styles.root}>
      <ARSTableToolbar
        variant="Split"
        showMore
        hideActionIcon
        actionLabel="Add member"
        onAction={openAdd}
        search={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
      />
      <ARSGroupTable
        rows={rows.slice((safePage - 1) * pageSize, safePage * pageSize)}
        selectedIds={selected}
        onSelectedIdsChange={(ids) => setSelectedSet(new Set(ids))}
      />
      <ARSPagination
        page={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      <ModalOverlay open={addOpen} onClose={closeAdd} label="Add Member">
        <ARSAddMemberModal
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
    </div>
  );
}
