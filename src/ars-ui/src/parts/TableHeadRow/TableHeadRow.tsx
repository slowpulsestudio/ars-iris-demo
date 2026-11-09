import { cx } from '@iris/lib/cx.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { TableHeadItem } from '../TableHeadItem/TableHeadItem.js';
import styles from './TableHeadRow.module.css';

export interface TableHeadColumn {
  icon: string;
  label: string;
  /** Width from Figma; omit to fill. */
  width?: number;
}

export interface TableHeadRowProps {
  columns: TableHeadColumn[];
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}

/** Head row shared by the ARS table heads: select-all, labelled columns, action column. */
export function TableHeadRow({
  columns,
  allSelected = false,
  someSelected = false,
  onSelectAll,
  className,
}: TableHeadRowProps) {
  return (
    <div role="row" className={cx(styles.head, className)}>
      <TableHeadItem inset="s" className={styles.check}>
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={onSelectAll}
          ariaLabel="Select all"
        />
      </TableHeadItem>
      {columns.map((col) => (
        <TableHeadItem
          key={col.label}
          icon={col.icon}
          label={col.label}
          style={col.width != null ? { width: col.width } : undefined}
          className={col.width == null ? styles.fill : undefined}
        />
      ))}
      <TableHeadItem className={styles.actions} aria-label="Actions" />
    </div>
  );
}
