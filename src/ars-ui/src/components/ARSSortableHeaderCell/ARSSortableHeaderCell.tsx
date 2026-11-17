import type { CSSProperties, ReactNode, Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { TableHeadItem } from '@iris/components/TableHeadItem/TableHeadItem.js';
import styles from './ARSSortableHeaderCell.module.css';

export type ARSSortDirection = 'ascending' | 'descending';

/** A column's multi-select filter: the values its menu lists with checkboxes, and the ticked ones. */
export interface ARSColumnFilter {
  options: readonly string[];
  selected: readonly string[];
  onChange: (selected: string[]) => void;
}

/** Sorting and filtering from a table's column heads. Columns are named by their labels. */
export interface ARSColumnSorting {
  /** The columns whose heads sort; the others keep a plain head. */
  sortable: readonly string[];
  /** The column the rows are sorted by, and which way. */
  sortedBy?: { column: string; direction: ARSSortDirection };
  onSort: (column: string, direction: ARSSortDirection) => void;
  /** Columns a filter applies to: their heads show Filtered. */
  filtered?: readonly string[];
  /** The columns whose menus list values to filter by, keyed by column. */
  filters?: Readonly<Record<string, ARSColumnFilter>>;
}

export interface ARSSortableHeaderCellProps {
  label: string;
  /** Icon before the label, as on the ARS list heads. */
  icon?: string;
  /** The rows are sorted by this column, this way (Figma "Sorted ascending", "Sorted descending"). */
  sort?: ARSSortDirection;
  /** A filter applies to this column (Figma "Filtered"). */
  filtered?: boolean;
  onSort?: (direction: ARSSortDirection) => void;
  /** Lists the column's values under the sort items, each with a checkbox, and a Clear button under them. */
  filter?: ARSColumnFilter;
  className?: string;
  style?: CSSProperties;
  /** Placed in the cell after the label button, e.g. the Adjust columns resize grip. */
  children?: ReactNode;
}

const SORT_ICON: Record<ARSSortDirection, string> = { ascending: 'SortAscending', descending: 'SortDescending' };

/**
 * IM / Sortable header cell — a column head that opens the Iris Menu: Sort ascending, Sort descending and, with
 * `filter`, the column's values as a multi-select that stays open, with the Iris MultiSelect's Clear under them. The icon after the label shows the state.
 * Built on the Iris ".Table head item" with a right icon (Iris UI Kit 7814:4203).
 * Figma: IM / Sortable header cell 1262:1547 in Attestation | ReCertification.
 */
export function ARSSortableHeaderCell({ label, icon, sort, filtered = false, onSort, filter, className, style, children }: ARSSortableHeaderCellProps) {
  const ticked = filter?.selected ?? [];
  const items: MenuEntry[] = [
    { kind: 'item', label: 'Sort ascending', icon: SORT_ICON.ascending, selected: sort === 'ascending', onSelect: () => onSort?.('ascending') },
    { kind: 'item', label: 'Sort descending', icon: SORT_ICON.descending, selected: sort === 'descending', onSelect: () => onSort?.('descending') },
    ...(filter?.options.length
      ? [
          { kind: 'divider' as const },
          ...filter.options.map((value) => ({
            kind: 'checkbox' as const,
            label: value,
            checked: ticked.includes(value),
            onChange: (checked: boolean) => filter.onChange(checked ? [...ticked, value] : ticked.filter((v) => v !== value)),
          })),
        ]
      : []),
  ];

  return (
    <TableHeadItem aria-sort={sort} className={cx(styles.cell, className)} style={style}>
      <Menu
        align="start"
        ariaLabel={`${label} column`}
        items={items}
        footer={
          filter?.options.length ? (
            <Button variant="ghost" role="menuitem" onClick={() => filter.onChange([])}>
              Clear
            </Button>
          ) : undefined
        }
        trigger={({ ref, onClick, expanded }) => (
          <button
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            className={styles.trigger}
            aria-haspopup="menu"
            aria-expanded={expanded}
            aria-label={filtered ? `${label}, filtered` : label}
            onClick={onClick}
          >
            {icon && <Icon name={icon} size="20px" className={styles.icon} />}
            <span className={styles.label}>{label}</span>
            {filtered && <Icon name="FunnelSimple" size="20px" className={cx(styles.state, styles.active)} />}
            {(sort || !filtered) && (
              <Icon name={sort ? SORT_ICON[sort] : 'CaretUpDown'} size="20px" className={cx(styles.state, sort && styles.active)} />
            )}
          </button>
        )}
      />
      {children}
    </TableHeadItem>
  );
}
