import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import type { PaginationEllipsis } from '@iris/components/Pagination/Pagination.js';
import { TableHeadRow, type TableHeadColumn } from '../../parts/TableHeadRow/TableHeadRow.js';
import { MIXED_OBJECT_COLUMNS } from '../ARSTableHeadMixedObj/ARSTableHeadMixedObj.js';
import { ARSPagination } from '../ARSPagination/ARSPagination.js';
import { ARSRow, type ARSRowProps } from '../ARSRow/ARSRow.js';
import styles from './ARSTable.module.css';

export type ARSTableVariant = 'Default' | 'filter' | 'Empty' | 'Mixed';

export type ARSTableRow = Omit<ARSRowProps, 'variant' | 'selected' | 'onSelectedChange' | 'className'> & {
  id: string;
};

/** Column heads drawn in the Default and filter variants (not the head_single_obj component). */
const USER_COLUMNS: TableHeadColumn[] = [
  { icon: 'IdentificationCard', label: 'Display name', width: 180 },
  { icon: 'UserCircleCheck', label: 'Status', width: 86 },
  { icon: 'ArticleNyTimes', label: 'Description' },
  { icon: 'Tag', label: 'Tags', width: 231 },
  { icon: 'BuildingOffice', label: 'Location', width: 180 },
];

/** The filter variant adds an icon after "Display name", pushing later heads right. */
const FILTER_COLUMNS: TableHeadColumn[] = [
  {
    ...USER_COLUMNS[0],
    trailing: <Icon name="IdentificationCard" size="20px" className={styles.filterMark} />,
  },
  ...USER_COLUMNS.slice(1),
];

/** The Mixed variant uses head_Mixed_obj, with "Display name" as the first label. */
const MIXED_COLUMNS: TableHeadColumn[] = [
  { ...MIXED_OBJECT_COLUMNS[0], label: 'Display name' },
  ...MIXED_OBJECT_COLUMNS.slice(1),
];

export interface ARSTableProps {
  /** Figma "Variant". */
  variant?: ARSTableVariant;
  rows?: ARSTableRow[];
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  page?: number;
  pageCount?: number;
  pages?: (number | PaginationEllipsis)[];
  onPageChange?: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Empty variant: the columns button in the header. */
  onColumns?: () => void;
  className?: string;
}

function EmptyHeader({ onColumns }: { onColumns?: () => void }) {
  return (
    <div role="row" className={styles.emptyHead}>
      <span aria-hidden="true" />
      {['Display Name', 'Status', 'Description', 'Tags', 'Location'].map((label) => (
        <span key={label} role="columnheader" className={styles.emptyHeadLabel}>
          {label}
        </span>
      ))}
      <IconButton icon="Columns" ariaLabel="Columns" onClick={onColumns} />
    </div>
  );
}

/** ARS_Table — the directory list: head, object rows and pagination. Figma: 99:30760. */
export function ARSTable({
  variant = 'Default',
  rows = [],
  selected = new Set(),
  onSelectionChange,
  page = 1,
  pageCount = 1,
  pages,
  onPageChange,
  pageSize = 15,
  pageSizeOptions,
  onPageSizeChange,
  emptyTitle = 'No directory or folder selected.',
  emptyDescription = 'Choose a directory or folder to display its contents here.',
  onColumns,
  className,
}: ARSTableProps) {
  if (variant === 'Empty') {
    return (
      <div role="table" className={cx(styles.table, className)}>
        <EmptyHeader onColumns={onColumns} />
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{emptyTitle}</p>
          <p className={styles.emptyDescription}>{emptyDescription}</p>
        </div>
      </div>
    );
  }

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectionChange?.(next);
  };

  const columns =
    variant === 'Mixed' ? MIXED_COLUMNS : variant === 'filter' ? FILTER_COLUMNS : USER_COLUMNS;

  return (
    <div role="table" className={cx(styles.table, className)}>
      <TableHeadRow
        columns={columns}
        allSelected={allSelected}
        someSelected={selected.size > 0}
        onSelectAll={(on) => onSelectionChange?.(on ? new Set(rows.map((r) => r.id)) : new Set())}
      />
      {rows.map(({ id, ...row }) => (
        <ARSRow
          key={id}
          variant={variant === 'Mixed' ? 'Mixed' : 'User'}
          selected={selected.has(id)}
          onSelectedChange={(on) => toggle(id, on)}
          {...row}
        />
      ))}
      <ARSPagination
        className={styles.pagination}
        page={page}
        pageCount={pageCount}
        pages={pages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
