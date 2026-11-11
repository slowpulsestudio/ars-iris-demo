import { Button } from '@iris/components/Button/Button.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { TableCell, CellText } from '@iris/components/TableCell/TableCell.js';
import { ARSPagination, type ARSPaginationProps } from '../ARSPagination/ARSPagination.js';
import { ARSSelectedObjectsBlock, type ARSSelectedObjectsBlockItem } from '../ARSSelectedObjectsBlock/ARSSelectedObjectsBlock.js';
import { ARSTableToolbar } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import { TableHeadRow } from '../../parts/TableHeadRow/TableHeadRow.js';
import styles from './ARSAddMemberModal.module.css';

export interface ARSAddMemberRow {
  id: string;
  name: string;
  objectType: string;
  description: string;
}

export interface ARSAddMemberModalProps {
  /** "Object found: N". */
  found: number;
  rows: ARSAddMemberRow[];
  selectedIds: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** The chosen objects, across pages, as removable tags. */
  selectedItems: ARSSelectedObjectsBlockItem[];
  search?: string;
  onSearchChange?: (value: string) => void;
  pagination: ARSPaginationProps;
  onClose?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/**
 * Add Member modal: find objects, tick the ones to add, see them below and
 * Save. Figma: Modal 215:7485 in ARS_WebUI2_Groups (not in ARS - Primary).
 */
export function ARSAddMemberModal({
  found,
  rows,
  selectedIds,
  onSelectedIdsChange,
  selectedItems,
  search,
  onSearchChange,
  pagination,
  onClose,
  onCancel,
  onSave,
  className,
}: ARSAddMemberModalProps) {
  const selected = new Set(selectedIds);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) =>
    onSelectedIdsChange?.(on ? [...selectedIds, id] : selectedIds.filter((s) => s !== id));

  return (
    <ModalPanel
      title="Add Member"
      supportingText={`Object found: ${found}`}
      onClose={onClose}
      className={className}
      bodyClassName={styles.body}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </>
      }
    >
      <ARSTableToolbar variant="4" search={search} onSearchChange={onSearchChange} />
      <div role="table" aria-label="Objects" className={styles.table}>
        <TableHeadRow
          columns={[{ label: 'Name', width: 150 }, { label: 'Object type', width: 110 }, { label: 'Description' }]}
          allSelected={allSelected}
          someSelected={rows.some((r) => selected.has(r.id))}
          onSelectAll={(on) => {
            const ids = new Set(selectedIds);
            rows.forEach((r) => (on ? ids.add(r.id) : ids.delete(r.id)));
            onSelectedIdsChange?.([...ids]);
          }}
          actionsWidth={0}
        />
        {rows.map((row) => (
          <div key={row.id} role="row" className={styles.row}>
            <TableCell inset="s" className={styles.check}>
              <Checkbox checked={selected.has(row.id)} onChange={(on) => toggle(row.id, on)} ariaLabel={`Select ${row.name}`} />
            </TableCell>
            <TableCell className={styles.name}>
              <CellText strong>{row.name}</CellText>
            </TableCell>
            <TableCell className={styles.type}>
              <CellText>{row.objectType}</CellText>
            </TableCell>
            <TableCell className={styles.fill}>
              <CellText>{row.description}</CellText>
            </TableCell>
          </div>
        ))}
      </div>
      <ARSPagination {...pagination} />
      {selectedItems.length > 0 && (
        <ARSSelectedObjectsBlock
          items={selectedItems}
          onRemove={(id) => onSelectedIdsChange?.(selectedIds.filter((s) => s !== id))}
        />
      )}
    </ModalPanel>
  );
}
