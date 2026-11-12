import type { DragEvent, MouseEvent } from 'react';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { TableCell, CellText } from '@iris/components/TableCell/TableCell.js';
import type { ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import type { ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ARSPagination, type ARSPaginationProps } from '../ARSPagination/ARSPagination.js';
import { TableHeadRow } from '../../parts/TableHeadRow/TableHeadRow.js';
import { ContentScreen } from '../../parts/ContentScreen/ContentScreen.js';
import styles from './ARSTreeViewADContent.module.css';

export interface ARSTreeViewADRow {
  id: string;
  name: string;
  icon: string;
  href?: string;
  objectType: string;
  description: string;
}

export interface ARSTreeViewADContentProps {
  /** ARS_Header; Figma uses Variant1 (Folder icon). */
  header: ARSHeaderProps;
  /** ARS_Table_Toolbar; Figma uses the "Basic" variant. */
  toolbar?: ARSTableToolbarProps;
  rows: ARSTreeViewADRow[];
  /** Heading of the middle column; Figma's Groups list calls it "Group type". */
  typeLabel?: string;
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  onColumns?: () => void;
  onMore?: (id: string, event: MouseEvent<HTMLElement>) => void;
  /** Makes rows draggable, e.g. onto a folder in the directory tree. */
  onRowDragStart?: (id: string, event: DragEvent<HTMLElement>) => void;
  onRowDragEnd?: () => void;
  pagination: ARSPaginationProps;
  className?: string;
}

/**
 * Tree_View_AD_Content — the contents of an AD folder in Tree view:
 * ARS_Header, ARS_Table_Toolbar, a Name / Object type / Description table
 * and ARS_Pagination. Figma: 4517:19943.
 */
export function ARSTreeViewADContent({
  header,
  toolbar,
  rows,
  typeLabel = 'Object type',
  selected = new Set(),
  onSelectionChange,
  onColumns,
  onMore,
  onRowDragStart,
  onRowDragEnd,
  pagination,
  className,
}: ARSTreeViewADContentProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectionChange?.(next);
  };

  return (
    <ContentScreen header={header} toolbar={toolbar} className={className}>
      <div role="table" className={styles.table}>
        <TableHeadRow
          columns={[
            { label: 'Name', width: 180 },
            { label: typeLabel, width: 119 },
            { label: 'Description' },
          ]}
          allSelected={allSelected}
          someSelected={selected.size > 0}
          onSelectAll={(on) => onSelectionChange?.(on ? new Set(rows.map((r) => r.id)) : new Set())}
          actionsWidth={70}
          actions={<IconButton icon="SlidersHorizontal" ariaLabel="Columns" onClick={onColumns} />}
        />
        {rows.map((row) => (
          <div
            key={row.id}
            role="row"
            className={styles.row}
            draggable={!!onRowDragStart}
            onDragStart={onRowDragStart && ((e) => onRowDragStart(row.id, e))}
            onDragEnd={onRowDragEnd}
          >
            <TableCell inset="s" className={styles.check}>
              <Checkbox
                checked={selected.has(row.id)}
                onChange={(on) => toggle(row.id, on)}
                ariaLabel={`Select ${row.name}`}
              />
            </TableCell>
            <TableCell gap="s" className={styles.name}>
              <Icon name={row.icon} size="20px" className={styles.icon} />
              <Link href={row.href ?? '#'} className={styles.nameLink}>
                {row.name}
              </Link>
            </TableCell>
            <TableCell className={styles.type}>
              <CellText>{row.objectType}</CellText>
            </TableCell>
            <TableCell className={styles.fill}>
              <CellText>{row.description}</CellText>
            </TableCell>
            <TableCell inset="button" className={styles.actions}>
              <IconButton icon="DotsThree" ariaLabel={`More actions for ${row.name}`} onClick={(e) => onMore?.(row.id, e)} />
            </TableCell>
          </div>
        ))}
        <ARSPagination sticky className={styles.pagination} {...pagination} />
      </div>
    </ContentScreen>
  );
}
