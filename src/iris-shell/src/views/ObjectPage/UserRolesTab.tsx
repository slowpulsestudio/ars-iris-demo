import { useMemo, useState } from 'react';
import { ARSGroupTable, ARSPagination, ARSTableToolbar } from '@ars';
import { cx } from '../../lib/cx.js';
import { useHashSelection } from '../../lib/hashState.js';
import { userRoles } from '../../lib/userRoles.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { ListBulkBar } from '../ListBulkBar/ListBulkBar.js';
import { NAMED_OBJECT_FIELDS } from './namedObjectFields.js';
import screen from '../ARSScreen/ARSScreen.module.css';
import styles from './GroupMembersTab.module.css';

const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];

export interface UserRolesTabProps {
  userId: string;
}

/**
 * UserRolesTab — a user's Roles tab: the roles assigned to the user, as many
 * as the Overview card and the tab label say. Figma draws no content for this
 * tab ("Roles/Access Templates NEW"), so it reuses the Memberships tab's
 * layout (search, table, paging) with sample roles.
 */
export function UserRolesTab({ userId }: UserRolesTabProps) {
  const roles = userRoles(userId);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedSet, setSelectedSet] = useHashSelection();
  const selected = useMemo(() => [...selectedSet], [selectedSet]);

  const mf = useAdvancedFilter(roles, NAMED_OBJECT_FIELDS);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mf.filtered
      .filter((r) => !q || [r.name, r.description, r.objectId].some((v) => v.toLowerCase().includes(q)))
      .map((r) => ({
        id: r.id,
        name: r.name,
        objectType: 'Role',
        description: r.description,
        objectId: r.objectId,
        // The sample roles have no pages of their own, so a name opens Access templates.
        href: '#/access-templates',
      }));
  }, [mf.filtered, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  return (
    <div className={cx(styles.root, selected.length > 0 && screen.withBar)}>
      <ARSTableToolbar
        variant="4"
        search={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onFilter={mf.onFilter}
        filterCount={mf.filterCount}
        filterPressed={mf.filterPressed}
      />
      {mf.emptyWhen(rows.length) ?? (
        <>
          <ARSGroupTable
            ariaLabel="Roles"
            rows={rows.slice((safePage - 1) * pageSize, safePage * pageSize)}
            selectedIds={selected}
            onSelectedIdsChange={(ids) => setSelectedSet(new Set(ids))}
          />
          <ARSPagination
            className={styles.room}
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
          <ListBulkBar rows={rows} selectedIds={selected} onSelectedIdsChange={(ids) => setSelectedSet(new Set(ids))} />
        </>
      )}
    </div>
  );
}
