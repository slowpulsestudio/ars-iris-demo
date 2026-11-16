import { useMemo } from 'react';
import type { ARSColumnSorting, ARSSortDirection } from '@ars';
import { slug, useHashParam } from '../../lib/hashState.js';
import type { AdvancedFilter } from './useAdvancedFilter.js';

/** One column a list sorts by. */
export interface SortColumn<T> {
  /** The column's heading, exactly as the table draws it. */
  label: string;
  /** The text the column shows for an item. Several values (tags) sort as one comma-joined text. */
  value: (item: T) => string | string[];
  /** The list's Advanced filter field behind the column: its values to tick in the head's menu, and the Filtered state. */
  field?: string;
}

export interface ColumnSort<T> {
  /** The items in the chosen order; as given while no column is chosen. */
  sorted: T[];
  /** For the table's `sorting` prop. */
  sorting: ARSColumnSorting;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const asText = (value: string | string[]): string => (Array.isArray(value) ? value.join(', ') : value).trim();

/**
 * Sorting from a list's column heads (IM / Sortable header cell): one column at a time, by the text the column
 * shows, kept in the address as `?sort=<column>.asc` or `?sort=<column>.desc`. Blank values go last either way.
 * Sort before paging, so the order runs across the pages. `onSortChange` runs on a new order, e.g. to go back to
 * page 1. Without `filter`, the menus only sort.
 */
export function useColumnSort<T>(
  items: T[],
  columns: SortColumn<T>[],
  filter?: Pick<AdvancedFilter<T>, 'columnFilter' | 'filteredFields'>,
  onSortChange?: () => void,
): ColumnSort<T> {
  const [param, setParam] = useHashParam('sort');
  const [key, way] = (param ?? '').split('.');
  const column = columns.find((c) => slug(c.label) === key);
  const direction: ARSSortDirection = way === 'desc' ? 'descending' : 'ascending';

  const sorted = useMemo(() => {
    if (!column) return items;
    const sign = direction === 'descending' ? -1 : 1;
    return items
      .map((item) => ({ item, text: asText(column.value(item)) }))
      .sort((a, b) => (!a.text !== !b.text ? (a.text ? -1 : 1) : sign * collator.compare(a.text, b.text)))
      .map((entry) => entry.item);
  }, [items, column, direction]);

  const filterColumns = filter ? columns.filter((c) => c.field) : [];
  const sorting: ARSColumnSorting = {
    sortable: columns.map((c) => c.label),
    sortedBy: column ? { column: column.label, direction } : undefined,
    onSort: (label, next) => {
      setParam(`${slug(label)}.${next === 'descending' ? 'desc' : 'asc'}`);
      onSortChange?.();
    },
    filtered: filterColumns.filter((c) => filter?.filteredFields.has(c.field!)).map((c) => c.label),
    filters: Object.fromEntries(
      filterColumns.flatMap((c) => {
        const columnFilter = filter?.columnFilter(c.field!);
        return columnFilter ? [[c.label, columnFilter]] : [];
      }),
    ),
  };

  return { sorted, sorting };
}
