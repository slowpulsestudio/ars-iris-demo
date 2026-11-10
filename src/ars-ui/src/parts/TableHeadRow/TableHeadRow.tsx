import { Fragment, type ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { TableHeadItem } from '@iris/components/TableHeadItem/TableHeadItem.js';
import styles from './TableHeadRow.module.css';

export interface TableHeadColumn {
  /** Omit for a text-only heading, as in ARS_Group_Table. */
  icon?: string;
  label: string;
  /** Width from Figma; omit to fill. */
  width?: number;
  /** Extra item placed right after this column in the row. */
  trailing?: ReactNode;
}

export interface TableHeadRowProps {
  columns: TableHeadColumn[];
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  /** Content of the last head cell, e.g. a column-settings button. */
  actions?: ReactNode;
  /** Width of the last head cell in px (default 44). */
  actionsWidth?: number;
  className?: string;
}

/** Head row shared by the ARS table heads: select-all, labelled columns, action column. */
export function TableHeadRow({
  columns,
  allSelected = false,
  someSelected = false,
  onSelectAll,
  actions,
  actionsWidth,
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
        <Fragment key={col.label}>
          <TableHeadItem
            icon={col.icon}
            label={col.label}
            style={col.width != null ? { width: col.width } : undefined}
            className={col.width == null ? styles.fill : undefined}
          />
          {col.trailing}
        </Fragment>
      ))}
      <TableHeadItem
        className={styles.actions}
        style={actionsWidth != null ? { width: actionsWidth } : undefined}
        aria-label="Actions"
      >
        {actions}
      </TableHeadItem>
    </div>
  );
}
