import type { MouseEventHandler } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Link } from '@iris/components/Link/Link.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { CellText, TableCell } from '@iris/components/TableCell/TableCell.js';
import { ARSPagination, type ARSPaginationProps } from '../ARSPagination/ARSPagination.js';
import { ARSTableToolbar } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ARSUserPageHeader } from '../ARSUserPageHeader/ARSUserPageHeader.js';
import { TableHeadRow } from '../../parts/TableHeadRow/TableHeadRow.js';
import styles from './ARSManagedUnitMembers.module.css';

export interface ARSManagedUnitMember {
  id: string;
  name: string;
  description: string;
  /** "User" or "Group". */
  type: string;
  href?: string;
}

export interface ARSManagedUnitMembersProps {
  /** The managed unit's name; the title reads "[name] Members". */
  unitName: string;
  /** "[Directory name] [Location]" under the title. */
  directory: string;
  location: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  rows: ARSManagedUnitMember[];
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  pagination: ARSPaginationProps;
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  onMore?: MouseEventHandler<HTMLElement>;
  className?: string;
}

/**
 * ARS_Managed_Unit_Members — a managed unit's members: the group-style header,
 * a search and a Name / Description / Type table with paging. Figma: 7074:6939
 * (ARS_WebUI2_Managed-Units), not in ARS - Primary.
 */
export function ARSManagedUnitMembers({
  unitName,
  directory,
  location,
  search,
  onSearchChange,
  rows,
  selected = new Set(),
  onSelectionChange,
  pagination,
  onBack,
  onNextItem,
  onPreviousItem,
  onMore,
  className,
}: ARSManagedUnitMembersProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectionChange?.(next);
  };

  return (
    <div className={cx(styles.root, className)}>
      <ARSUserPageHeader
        title={`${unitName} Members`}
        icon="UsersThree"
        objectClass={directory}
        objectName={location}
        onBack={onBack}
        onNextItem={onNextItem}
        onPreviousItem={onPreviousItem}
        onMore={onMore}
      />
      <ARSTableToolbar variant="4" search={search} onSearchChange={onSearchChange} searchPlaceholder={`Search all members of ${unitName}`} />
      <div role="table" aria-label="Members" className={styles.table}>
        <TableHeadRow
          columns={[{ label: 'Name', width: 220 }, { label: 'Description' }, { label: 'Type', width: 140 }]}
          allSelected={allSelected}
          someSelected={selected.size > 0}
          onSelectAll={(on) => onSelectionChange?.(on ? new Set(rows.map((r) => r.id)) : new Set())}
          actionsWidth={0}
        />
        {rows.map((row) => (
          <div key={row.id} role="row" className={styles.row}>
            <TableCell inset="s" className={styles.check}>
              <Checkbox checked={selected.has(row.id)} onChange={(on) => toggle(row.id, on)} ariaLabel={`Select ${row.name}`} />
            </TableCell>
            <TableCell gap="s" className={styles.name}>
              <Icon name={row.type === 'Group' ? 'UsersThree' : 'User'} size="20px" className={styles.icon} />
              <Link href={row.href ?? '#'} className={styles.nameLink}>
                {row.name}
              </Link>
            </TableCell>
            <TableCell className={styles.fill}>
              <CellText>{row.description}</CellText>
            </TableCell>
            <TableCell className={styles.type}>
              <CellText>{row.type}</CellText>
            </TableCell>
          </div>
        ))}
      </div>
      <ARSPagination {...pagination} />
    </div>
  );
}
