import { cx } from '@iris/lib/cx.js';
import { TableHeadRow, type TableHeadColumn } from '../../parts/TableHeadRow/TableHeadRow.js';
import { ARSTableGroupRow } from '../ARSTableGroupRow/ARSTableGroupRow.js';
import styles from './ARSGroupTable.module.css';

const COLUMNS: TableHeadColumn[] = [
  { label: 'Name', width: 180 },
  { label: 'Object Type', width: 119 },
  { label: 'Description', width: 359 },
  { label: 'Object ID' },
];

export interface ARSGroupTableRow {
  id: string;
  name: string;
  objectType?: string;
  description: string;
  objectId: string;
  href?: string;
}

export interface ARSGroupTableProps {
  rows: ARSGroupTableRow[];
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onMore?: (row: ARSGroupTableRow) => void;
  /** The table's accessible name; Figma's table lists groups. */
  ariaLabel?: string;
  className?: string;
}

/** ARS_Group_Table — groups with name, type, description and object ID. Figma: 2843:24904. */
export function ARSGroupTable({ rows, selectedIds = [], onSelectedIdsChange, onMore, ariaLabel = 'Groups', className }: ARSGroupTableProps) {
  const selected = new Set(selectedIds);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) =>
    onSelectedIdsChange?.(on ? [...selectedIds, id] : selectedIds.filter((s) => s !== id));

  return (
    <div role="table" aria-label={ariaLabel} className={cx(styles.table, className)}>
      <TableHeadRow
        columns={COLUMNS}
        allSelected={allSelected}
        someSelected={selected.size > 0}
        onSelectAll={(on) => onSelectedIdsChange?.(on ? rows.map((r) => r.id) : [])}
      />
      {rows.map((row) => (
        <ARSTableGroupRow
          key={row.id}
          {...row}
          selected={selected.has(row.id)}
          onSelectedChange={(on) => toggle(row.id, on)}
          onMore={() => onMore?.(row)}
        />
      ))}
    </div>
  );
}
