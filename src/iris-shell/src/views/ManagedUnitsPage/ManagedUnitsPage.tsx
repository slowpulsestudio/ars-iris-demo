import { useMemo, useState } from 'react';
import { ARSActionBar, ARSManagedUnitMembers, ARSManagedUsersContent } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { cx } from '../../lib/cx.js';
import { useHashSelection } from '../../lib/hashState.js';
import { MANAGED_UNITS, getManagedUnit, membersOf, type ManagedUnit } from '../../lib/managedUnits.js';
import { bucketAt, useDirectoryFilter } from '../../lib/directoryFilter.js';
import { sampleDates, sampleTags, type FilterRow } from '../../lib/listFilters.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { rowFields, type FilterFieldDef } from '../../lib/advancedFilter.js';
import { NoDirectoriesSelected } from '../NoDirectoriesSelected/NoDirectoriesSelected.js';
import { Button } from '../../components/Button/Button.js';
import screen from '../ARSScreen/ARSScreen.module.css';
import styles from '../UserDetailPage/UserDetailPage.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50];

/** What the Filters menu sees of a unit. Tags and dates are sample values; the list shows neither. */
const unitRow = (u: ManagedUnit): FilterRow => ({
  name: u.name,
  type: 'Managed Unit',
  tags: sampleTags(u.id),
  location: 'Managed Units',
  ...sampleDates(u.id),
});
const unitFields = rowFields(unitRow);

/** The members list's fields: its three columns. */
const memberFields: FilterFieldDef<{ id: string; name: string; description: string; type: string }>[] = [
  { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (m) => m.name },
  { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (m) => m.description },
  { id: 'Type', label: 'Type', icon: 'Lego', get: (m) => m.type, list: true },
];

/** ManagedUnitsPage — the Managed Units list (ARS_Managed_Users_Content); a row opens the unit's members. */
export function ManagedUnitsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useHashSelection();

  const [directories] = useDirectoryFilter();
  const units = useMemo(() => MANAGED_UNITS.filter((_, i) => directories.has(bucketAt(i))), [directories]);
  const lf = useAdvancedFilter(units, unitFields);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lf.filtered.filter((u) => !q || [u.name, u.description].some((v) => v.toLowerCase().includes(q)));
  }, [query, lf.filtered]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Managed Units' }]}>
      <ARSManagedUsersContent
        className={screen.screen}
        header={{ title: 'Managed Units', icon: 'FolderStar' }}
        empty={directories.size === 0 ? <NoDirectoriesSelected /> : lf.emptyWhen(rows.length)}
        toolbar={{
          variant: '4',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          onFilter: lf.onFilter,
          filterCount: lf.filterCount,
          filterPressed: lf.filterPressed,
        }}
        rows={rows.slice((safePage - 1) * pageSize, safePage * pageSize).map((u) => ({
          ...u,
          type: 'Managed Unit',
          href: `#/management-units/${u.id}`,
        }))}
        selected={selected}
        onSelectionChange={setSelected}
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
    </AppShell>
  );
}

export interface ManagedUnitMembersPageProps {
  unitId: string;
}

/** ManagedUnitMembersPage — a managed unit's members (ARS_Managed_Unit_Members). */
export function ManagedUnitMembersPage({ unitId }: ManagedUnitMembersPageProps) {
  const unit = getManagedUnit(unitId);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useHashSelection();

  const members = useMemo(() => membersOf(unitId), [unitId]);
  const mf = useAdvancedFilter(members, memberFields);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mf.filtered.filter((m) => !q || [m.name, m.description].some((v) => v.toLowerCase().includes(q)));
  }, [mf.filtered, query]);

  if (!unit) {
    return (
      <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Managed Units', onClick: () => navigate('#/management-units') }, { label: 'Not found' }]}>
        <div className={styles.missing}>
          <h1 className={styles.missingTitle}>Managed unit not found</h1>
          <p className={styles.missingBody}>
            We couldn’t find a managed unit with id <code>{unitId}</code>.
          </p>
          <Button variant="secondary" onClick={() => navigate('#/management-units')}>
            Back to Managed Units
          </Button>
        </div>
      </AppShell>
    );
  }

  const index = MANAGED_UNITS.findIndex((u) => u.id === unitId);
  const previous = MANAGED_UNITS[index - 1];
  const next = MANAGED_UNITS[index + 1];
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  return (
    <AppShell
      breadcrumb={[
        { label: 'Directory Management' },
        { label: 'Managed Units', onClick: () => navigate('#/management-units') },
        { label: unit.name },
      ]}
    >
      <ARSManagedUnitMembers
        className={cx(screen.screen, selected.size > 0 && screen.withBar)}
        unitName={unit.name}
        directory="O1D.local"
        location="Managed Units"
        search={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onFilter={mf.onFilter}
        filterCount={mf.filterCount}
        filterPressed={mf.filterPressed}
        rows={rows.slice((safePage - 1) * pageSize, safePage * pageSize)}
        selected={selected}
        onSelectionChange={setSelected}
        onBack={() => navigate('#/management-units')}
        onPreviousItem={previous ? () => navigate(`#/management-units/${previous.id}`) : undefined}
        onNextItem={next ? () => navigate(`#/management-units/${next.id}`) : undefined}
        empty={mf.emptyWhen(rows.length)}
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
      <ARSActionBar
        open={selected.size > 0}
        selectedCount={selected.size}
        totalCount={rows.length}
        showTotal
        layout="inline"
        onAction={(label) => {
          if (label === 'Select all') setSelected(new Set(rows.map((m) => m.id)));
        }}
        onDismiss={() => setSelected(new Set())}
      />
    </AppShell>
  );
}
