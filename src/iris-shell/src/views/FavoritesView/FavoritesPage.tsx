import { type MouseEvent } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { useFavorites, type FavoriteEntry } from '../../lib/useFavorites.js';
import { Link } from '../../components/Link/Link.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { ContentHeader } from '../../components/ContentHeader/ContentHeader.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import { Turntable } from '@lucasmarkes/hairline/react';
import { FilterTrigger } from '@iris-new';
import type { FilterFieldDef } from '../../lib/advancedFilter.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import styles from './FavoritesPage.module.css';

const COLUMNS: DataTableColumn<FavoriteEntry>[] = [
  {
    key: 'name',
    header: 'Name',
    icon: 'IdentificationCard',
    minWidth: '200px',
    grow: 1,
    cell: (f) => (
      <Link
        href={f.href}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          navigate(f.href);
        }}
      >
        {f.name}
      </Link>
    ),
  },
  { key: 'type', header: 'Type', icon: 'Tag', width: '180px', cell: (f) => f.type },
  {
    key: 'description',
    header: 'Description',
    icon: 'ArticleNyTimes',
    minWidth: '240px',
    grow: 2,
    cell: (f) => <span title={f.description}>{f.description ?? '—'}</span>,
  },
];

/** The columns as Advanced filter fields. Favourites use the Bar, not the Panel. */
const FIELDS: FilterFieldDef<FavoriteEntry>[] = [
  { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (f) => f.name },
  { id: 'Type', label: 'Type', icon: 'Tag', get: (f) => f.type, list: true },
  { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (f) => f.description ?? '' },
];

/**
 * FavoritesPage — a curated shortcut list of favorited objects. Rows deep-link
 * to each object's canonical detail.
 */
export function FavoritesPage() {
  const { entries, remove } = useFavorites();
  const lf = useAdvancedFilter(entries, FIELDS, 'bar');

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Favourites' }]}>
      <ContentHeader
        icon="Heart"
        title="Favourites"
        toolbarActions={entries.length > 0 ? <FilterTrigger active={lf.filterCount > 0} onClick={lf.onFilter} /> : undefined}
        filters={lf.bar}
      />

      {entries.length === 0 ? (
        <EmptyFigure
          figure={Turntable}
          title="No favourites yet"
          description="Star an object to see it here."
        />
      ) : (
        <div className={styles.tableWrap}>
          <DataTable
            rows={lf.filtered}
            columns={COLUMNS}
            emptyState={{ title: 'No favourites match', description: 'Nothing matches this filter.' }}
            ariaLabel="Favourites"
            rowLabel={(f) => f.name}
            rowActions={(f) => (
              <Tooltip label="Remove from favourites">
                <IconButton
                  icon="Trash"
                  ariaLabel={`Remove ${f.name} from favourites`}
                  size="s"
                  onClick={() => remove(f.id)}
                />
              </Tooltip>
            )}
          />
        </div>
      )}
      {lf.elements}
    </AppShell>
  );
}
