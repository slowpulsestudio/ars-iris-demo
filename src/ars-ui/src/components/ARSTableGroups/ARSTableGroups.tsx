import type { MouseEvent } from 'react';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { TableCell, CellText } from '@iris/components/TableCell/TableCell.js';
import { Tag } from '@iris/components/Tag/Tag.js';
import type { ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import type { ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ARSPagination, type ARSPaginationProps } from '../ARSPagination/ARSPagination.js';
import { TableHeadRow } from '../../parts/TableHeadRow/TableHeadRow.js';
import { ContentScreen } from '../../parts/ContentScreen/ContentScreen.js';
import styles from './ARSTableGroups.module.css';

export interface ARSTableGroupsRow {
  id: string;
  name: string;
  href?: string;
  /** e.g. O365Group or SecurityGroup. */
  groupType: string;
  groupTypeTone?: BadgeTone;
  description: string;
  tags: string[];
  /** e.g. Entra1 or AD1\Groups. */
  directory: string;
}

export interface ARSTableGroupsProps {
  header: ARSHeaderProps;
  toolbar?: ARSTableToolbarProps;
  rows: ARSTableGroupsRow[];
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  onRemoveTag?: (id: string, tag: string) => void;
  onColumns?: () => void;
  onMore?: (id: string, event: MouseEvent<HTMLElement>) => void;
  pagination: ARSPaginationProps;
  className?: string;
}

/**
 * ARS_Table_Groups — the Groups list: name, group type badge, description,
 * removable tags and directory. Figma: ARS_WebUI2_Groups 158:33464.
 */
export function ARSTableGroups({
  header,
  toolbar,
  rows,
  selected = new Set(),
  onSelectionChange,
  onRemoveTag,
  onColumns,
  onMore,
  pagination,
  className,
}: ARSTableGroupsProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectionChange?.(next);
  };

  return (
    <ContentScreen header={header} toolbar={toolbar} className={className}>
      <div role="table" aria-label="Groups" className={styles.table}>
        <TableHeadRow
          columns={[
            { icon: 'IdentificationCard', label: 'Name', width: 180 },
            { icon: 'UserCircleCheck', label: 'Group type', width: 170 },
            { icon: 'ArticleNyTimes', label: 'Description' },
            { icon: 'Tag', label: 'Tags', width: 220 },
            { icon: 'BuildingOffice', label: 'Directory', width: 150 },
          ]}
          allSelected={allSelected}
          someSelected={selected.size > 0}
          onSelectAll={(on) => onSelectionChange?.(on ? new Set(rows.map((r) => r.id)) : new Set())}
          actionsWidth={44}
          actions={<IconButton icon="SlidersHorizontal" ariaLabel="Columns" onClick={onColumns} />}
        />
        {rows.map((row) => (
          <div key={row.id} role="row" className={styles.row}>
            <TableCell inset="s" className={styles.check}>
              <Checkbox checked={selected.has(row.id)} onChange={(on) => toggle(row.id, on)} ariaLabel={`Select ${row.name}`} />
            </TableCell>
            <TableCell gap="s" className={styles.name}>
              <Icon name="UsersThree" size="20px" className={styles.icon} />
              <Link href={row.href ?? '#'} className={styles.nameLink}>
                {row.name}
              </Link>
            </TableCell>
            <TableCell className={styles.type}>
              <Badge tone={row.groupTypeTone ?? 'success'} className={styles.badge}>
                {row.groupType}
              </Badge>
            </TableCell>
            <TableCell className={styles.fill}>
              <CellText>{row.description}</CellText>
            </TableCell>
            <TableCell gap="s" className={styles.tags}>
              {row.tags.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  icon="X"
                  actionLabel={`Remove tag ${tag} from ${row.name}`}
                  onAction={onRemoveTag && (() => onRemoveTag(row.id, tag))}
                />
              ))}
            </TableCell>
            <TableCell className={styles.directory}>
              <CellText>{row.directory}</CellText>
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
