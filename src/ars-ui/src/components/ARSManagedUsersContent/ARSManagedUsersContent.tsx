import type { MouseEvent, ReactNode } from 'react';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { CellText, TableCell } from '@iris/components/TableCell/TableCell.js';
import type { ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import type { ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ARSPagination, type ARSPaginationProps } from '../ARSPagination/ARSPagination.js';
import { ContentScreen } from '../../parts/ContentScreen/ContentScreen.js';
import { TableHeadRow } from '../../parts/TableHeadRow/TableHeadRow.js';
import styles from './ARSManagedUsersContent.module.css';

export interface ARSManagedUnitRow {
  id: string;
  name: string;
  /** Modified date, as drawn: "10/24/23". */
  modified: string;
  description: string;
  /** "Managed Unit". */
  type: string;
  href?: string;
}

export interface ARSManagedUsersContentProps {
  header: ARSHeaderProps;
  toolbar?: ARSTableToolbarProps;
  /** Applied-filter pills between the toolbar and the table (not drawn in Figma). */
  filters?: ReactNode;
  /** Whether the pill row is open; it opens and closes with a height transition. */
  filtersOpen?: boolean;
  rows: ARSManagedUnitRow[];
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  /** The head's column settings button (Figma ARS_Table_Config). */
  onColumns?: (event: MouseEvent<HTMLElement>) => void;
  pagination: ARSPaginationProps;
  className?: string;
}

/**
 * ARS_Managed_Users_Content — the Managed Units list: ARS_Header, a search
 * toolbar and a Name / Modified / Description / Type table with paging.
 * Figma: 7058:6179 (ARS_WebUI2_Managed-Units), not in ARS - Primary.
 */
export function ARSManagedUsersContent({
  header,
  toolbar,
  filters,
  filtersOpen,
  rows,
  selected = new Set(),
  onSelectionChange,
  onColumns,
  pagination,
  className,
}: ARSManagedUsersContentProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectionChange?.(next);
  };

  return (
    <ContentScreen header={header} toolbar={toolbar} filters={filters} filtersOpen={filtersOpen} className={className}>
      <div role="table" aria-label="Managed units" className={styles.table}>
        {/* Figma: head 180 / 86 / fill / 155 and the 44px ARS_Table_Config; rows have no "…" and a 200px Type cell under Type and the config. */}
        <TableHeadRow
          columns={[
            { label: 'Name', width: 180 },
            { label: 'Modified', width: 86 },
            { label: 'Description' },
            { label: 'Type', width: 155 },
          ]}
          allSelected={allSelected}
          someSelected={selected.size > 0}
          onSelectAll={(on) => onSelectionChange?.(on ? new Set(rows.map((r) => r.id)) : new Set())}
          actions={<IconButton icon="SlidersHorizontal" ariaLabel="Columns" onClick={onColumns} />}
          actionsWidth={44}
        />
        {rows.map((row) => (
          <div key={row.id} role="row" className={styles.row}>
            <TableCell inset="s" className={styles.check}>
              <Checkbox checked={selected.has(row.id)} onChange={(on) => toggle(row.id, on)} ariaLabel={`Select ${row.name}`} />
            </TableCell>
            <TableCell gap="s" className={styles.name}>
              <Icon name="FolderStar" size="20px" className={styles.icon} />
              <Link href={row.href ?? '#'} className={styles.nameLink}>
                {row.name}
              </Link>
            </TableCell>
            <TableCell className={styles.modified}>
              <CellText>{row.modified}</CellText>
            </TableCell>
            <TableCell className={styles.fill}>
              <CellText>{row.description}</CellText>
            </TableCell>
            <TableCell className={styles.type}>
              <CellText>{row.type}</CellText>
            </TableCell>
          </div>
        ))}
        <ARSPagination sticky className={styles.pagination} {...pagination} />
      </div>
    </ContentScreen>
  );
}
