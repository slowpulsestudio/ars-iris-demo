import { useMemo, useState } from 'react';
import {
  ARSAddMemberModal,
  ARSGroupMembershipButtonSelect,
  ARSGroupTable,
  ARSPagination,
  ARSTableToolbar,
  type ARSGroupMembershipView,
} from '@ars';
import { useDirectory } from '../../lib/directoryStore.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import styles from './GroupMembersTab.module.css';

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];
const MODAL_PAGE_SIZE = 10;

/** A stable pick of `count` entries from `pool`, spread by a step from the group's id. */
function pick<T>(pool: T[], count: number, seed: string): T[] {
  if (pool.length === 0) return [];
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const step = (h % 5) + 1;
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i += 1) out.push(pool[(h + i * step) % pool.length]);
  return [...new Set(out)];
}

export interface GroupMembersTabProps {
  group: DirectoryObject;
  /** The folder the group is in; its objects stand in for members. */
  nodeId: string;
}

/**
 * GroupMembersTab — the Memberships tab (ARS_Group_Members_Content): Members
 * and Members of, a search, the group table with paging, and the Add Member
 * modal. The directory data has no memberships, so the rows are objects from
 * the group's folder.
 */
export function GroupMembersTab({ group, nodeId }: GroupMembersTabProps) {
  const { getSiblings } = useDirectory();
  const props = useGroupProps(group);
  // The sub-view, the ticked rows, the Add Member dialog and its chosen objects live in the address
  // (?tab=memberships&view=members-of&select=a,b&dialog=add-member&pick=c).
  const [viewParam, setViewParam] = useHashParam('view');
  const view: ARSGroupMembershipView = viewParam === 'members-of' ? 'Members of' : 'Members';
  const setView = (next: ARSGroupMembershipView) => setViewParam(next === 'Members' ? null : 'members-of');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // Figma's Memberships pagination shows "15 / page".
  const [pageSize, setPageSize] = useState(15);
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

  const pool = useMemo(() => getSiblings(nodeId).filter((o) => o.id !== group.id), [getSiblings, nodeId, group.id]);

  const members = useMemo(() => {
    const base = pick(pool, group.details.memberCount ?? 0, group.id);
    const added = pool.filter((o) => props.addedMembers.includes(o.id));
    return [...new Set([...base, ...added])];
  }, [pool, group, props.addedMembers]);

  const rows = useMemo(() => {
    const chosen = view === 'Members' ? members : pick(pool.filter((o) => o.type === 'group'), 3, group.id);
    const q = query.trim().toLowerCase();
    return chosen
      .filter((o) => !q || [o.name, o.description, o.id].some((v) => v.toLowerCase().includes(q)))
      .map((o) => ({
        id: o.id,
        name: o.name,
        objectType: OBJECT_TYPE_META[o.type].label,
        description: o.description,
        objectId: o.id,
        href: `#/tree/${nodeId}/${o.id}`,
      }));
  }, [pool, members, group.id, view, query, nodeId]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const candidates = useMemo(() => {
    const have = new Set(members.map((m) => m.id));
    const q = addQuery.trim().toLowerCase();
    return pool.filter((o) => !have.has(o.id) && (!q || [o.name, o.description, o.id].some((v) => v.toLowerCase().includes(q))));
  }, [pool, members, addQuery]);
  const addPageCount = Math.max(1, Math.ceil(candidates.length / MODAL_PAGE_SIZE));
  const addSafePage = Math.min(addPage, addPageCount);

  const openAdd = () => {
    setAddQuery('');
    setAddPage(1);
    setHashParams({ dialog: 'add-member', pick: null });
  };

  const closeAdd = () => setHashParams({ dialog: null, pick: null });

  const saveAdd = () => {
    saveGroupProps(group.id, { addedMembers: [...props.addedMembers, ...addSelected] });
    setHashParams({ dialog: null, pick: null, view: null });
    showToast(
      addSelected.length === 1 ? 'Member added successfully' : `${addSelected.length} members added successfully`,
      { supportingText: `Added to group ${group.name}.` },
    );
  };

  const switchView = (next: ARSGroupMembershipView) => {
    setView(next);
    setPage(1);
    setSelected([]);
  };

  return (
    <div className={styles.root}>
      <ARSGroupMembershipButtonSelect value={view} onChange={switchView} />
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
      <ARSGroupTable rows={pageRows} selectedIds={selected} onSelectedIdsChange={setSelected} />
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
