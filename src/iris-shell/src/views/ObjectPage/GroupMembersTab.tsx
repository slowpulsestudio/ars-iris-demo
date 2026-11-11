import { useMemo, useState } from 'react';
import {
  ARSGroupMembershipButtonSelect,
  ARSGroupTable,
  ARSPagination,
  ARSTableToolbar,
  type ARSGroupMembershipView,
} from '@ars';
import { useDirectory } from '../../lib/directoryStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import styles from './GroupMembersTab.module.css';

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];

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
 * and Members of, a search, and the group table with paging. The directory
 * data has no memberships, so the rows are objects from the group's folder.
 */
export function GroupMembersTab({ group, nodeId }: GroupMembersTabProps) {
  const { getSiblings } = useDirectory();
  const [view, setView] = useState<ARSGroupMembershipView>('Members');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => {
    const pool = getSiblings(nodeId).filter((o) => o.id !== group.id);
    const chosen =
      view === 'Members'
        ? pick(pool, group.details.memberCount ?? 0, group.id)
        : pick(pool.filter((o) => o.type === 'group'), 3, group.id);
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
  }, [getSiblings, nodeId, group, view, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const switchView = (next: ARSGroupMembershipView) => {
    setView(next);
    setPage(1);
    setSelected([]);
  };

  return (
    <div className={styles.root}>
      <ARSGroupMembershipButtonSelect value={view} onChange={switchView} />
      <ARSTableToolbar
        variant="Basic"
        actionLabel="Add member"
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
    </div>
  );
}
