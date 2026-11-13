import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { TableHeadRow, type TableHeadColumn } from '../../parts/TableHeadRow/TableHeadRow.js';
import { ARSTableGroupRow } from '../ARSTableGroupRow/ARSTableGroupRow.js';
import styles from './ARSGroupTable.module.css';

export type ARSGroupTableVariant = 'Groups' | 'Memberships';

const columnsFor = (variant: ARSGroupTableVariant): TableHeadColumn[] => [
  { label: 'Name', width: 180 },
  // The Memberships table's Object Type is wider (167:8093).
  { label: 'Object Type', width: variant === 'Memberships' ? 165 : 119 },
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
  /** Memberships: the object's type icon before its name. */
  icon?: string;
}

export interface ARSGroupTableProps {
  rows: ARSGroupTableRow[];
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onMore?: (row: ARSGroupTableRow) => void;
  /**
   * "Memberships" is the Groups file's ARS_Group_Object_Memberships table (ARS_WebUI2_Groups 167:8089):
   * type icons, names in primary text, a wider Object Type, a remove button on each row and the table
   * settings button (ARS_Table_Config) in the head.
   */
  variant?: ARSGroupTableVariant;
  /** Memberships: the remove button on each row. */
  onRemove?: (row: ARSGroupTableRow) => void;
  /** Memberships: the table settings button in the head (Media/SlidersHorizontal, 167:8096). */
  onSettings?: () => void;
  /** The table's accessible name; Figma's table lists groups. */
  ariaLabel?: string;
  className?: string;
}

/** ARS_Group_Table — groups with name, type, description and object ID. Figma: 2843:24904. */
export function ARSGroupTable({
  rows,
  selectedIds = [],
  onSelectedIdsChange,
  onMore,
  variant = 'Groups',
  onRemove,
  onSettings,
  ariaLabel = 'Groups',
  className,
}: ARSGroupTableProps) {
  const selected = new Set(selectedIds);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) =>
    onSelectedIdsChange?.(on ? [...selectedIds, id] : selectedIds.filter((s) => s !== id));

  return (
    <div role="table" aria-label={ariaLabel} className={cx(styles.table, className)}>
      <TableHeadRow
        columns={columnsFor(variant)}
        allSelected={allSelected}
        someSelected={selected.size > 0}
        onSelectAll={(on) => onSelectedIdsChange?.(on ? rows.map((r) => r.id) : [])}
        actions={
          variant === 'Memberships' ? (
            <IconButton icon="SlidersHorizontal" ariaLabel="Table settings" onClick={onSettings} />
          ) : undefined
        }
      />
      {rows.map((row) => (
        <ARSTableGroupRow
          key={row.id}
          {...row}
          variant={variant}
          selected={selected.has(row.id)}
          onSelectedChange={(on) => toggle(row.id, on)}
          onMore={() => onMore?.(row)}
          onRemove={() => onRemove?.(row)}
        />
      ))}
    </div>
  );
}
