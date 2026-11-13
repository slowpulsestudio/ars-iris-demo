import { useMemo, useState } from 'react';
import { Turntable } from '@lucasmarkes/hairline/react';
import { ARSFilterArea, ARSTreeViewADContent } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import { Menu } from '../../components/Menu/Menu.js';
import { OBJECT_TYPE_META } from '../../lib/directoryData.js';
import { cx } from '../../lib/cx.js';
import { isoDaysAgo, type FilterFieldDef } from '../../lib/advancedFilter.js';
import { sampleDates } from '../../lib/listFilters.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useFavorites, type FavoriteEntry } from '../../lib/useFavorites.js';
import { renderArsFilterTag } from '../ListFilters/arsFilterTag.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { ListBulkBar } from '../ListBulkBar/ListBulkBar.js';
import screen from '../ARSScreen/ARSScreen.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50];

/** The columns as Advanced filter fields. Favourites use the Bar, not the Panel. */
const FIELDS: FilterFieldDef<FavoriteEntry>[] = [
  { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (f) => f.name },
  { id: 'Object type', label: 'Object type', icon: 'Lego', get: (f) => f.type, list: true },
  { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (f) => f.description ?? '' },
  // Sample dates, as on the other lists: a favourite has none of its own.
  { id: 'Date active', label: 'Date active', icon: 'CalendarDots', get: (f) => isoDaysAgo(sampleDates(f.id).activeDaysAgo), date: true },
];

const iconFor = (type: string): string =>
  Object.values(OBJECT_TYPE_META).find((m) => m.label === type)?.icon ?? 'Cube';

/** A favourite folder opens in the Favourites view, anything else on its own page. */
const hrefFor = (f: FavoriteEntry): string => (f.type === 'Folder' ? `#/favorites/${f.id}` : f.href);

/**
 * FavoritesPage — the favourited objects as a list: ARS_Header, the toolbar with the Filters button,
 * the filter area (pills, Add, Clear) and a Name / Object type / Description table.
 * Figma: ARS - Favorites 4145:13627 in ARS_WebUI2_Advanced-Search. The filter is the Advanced filter Bar.
 */
export function FavoritesPage() {
  const { entries, remove } = useFavorites();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const rowMenu = useAnchoredMenu();
  const [rowId, setRowId] = useState<string | null>(null);
  const lf = useAdvancedFilter(entries, FIELDS, 'bar', { renderPill: renderArsFilterTag, inlinePills: true });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lf.filtered.filter((f) => !q || [f.name, f.description ?? ''].some((v) => v.toLowerCase().includes(q)));
  }, [lf.filtered, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const empty =
    entries.length === 0 ? (
      <EmptyFigure figure={Turntable} title="No favourites yet" description="Star an object to see it here." />
    ) : rows.length === 0 ? (
      (lf.emptyWhen(0) ?? <EmptyFigure figure={Turntable} title="No favourites match" description="Nothing matches the search." />)
    ) : undefined;

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Favourites' }]}>
      <ARSTreeViewADContent
        className={cx(screen.screen, selected.size > 0 && screen.withBar)}
        header={{ title: 'Favourites', icon: 'Star' }}
        toolbar={{
          variant: '4',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          onFilter: lf.onFilter,
          filterCount: lf.filterCount,
        }}
        filters={
          <ARSFilterArea onAdd={lf.onFilter} onClear={lf.clear}>
            {lf.bar}
          </ARSFilterArea>
        }
        filtersOpen={Boolean(lf.bar)}
        rows={rows.slice((safePage - 1) * pageSize, safePage * pageSize).map((f) => ({
          id: f.id,
          name: f.name,
          icon: iconFor(f.type),
          href: hrefFor(f),
          objectType: f.type,
          description: f.description ?? '',
        }))}
        selected={selected}
        onSelectionChange={setSelected}
        onMore={(id, event) => {
          setRowId(id);
          rowMenu.openAt(event);
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
        empty={empty}
      />
      <ListBulkBar
        rows={rows.map((f) => ({ id: f.id, href: hrefFor(f) }))}
        selectedIds={[...selected]}
        onSelectedIdsChange={(ids) => setSelected(new Set(ids))}
      />
      <Menu
        {...rowMenu.menuProps}
        ariaLabel="Favourite actions"
        items={[
          {
            kind: 'item',
            label: 'Remove from favourites',
            icon: 'Trash',
            onSelect: () => {
              if (rowId) remove(rowId);
            },
          },
        ]}
      />
      {lf.elements}
    </AppShell>
  );
}
