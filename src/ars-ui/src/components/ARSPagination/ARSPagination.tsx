import type { Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { Pagination, type PaginationEllipsis } from '@iris/components/Pagination/Pagination.js';
import styles from './ARSPagination.module.css';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export interface ARSPaginationProps {
  /** Current 1-based page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Page slots to show. Defaults to the Iris pagination rule. */
  pages?: (number | PaginationEllipsis)[];
  /** Items per page, shown as "10 / page". */
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

/**
 * ARS_Pagination — the Iris Pagination's page actions (Iris UI Kit "Page
 * action", with First and Last) and the ARS file's "10 / page" button.
 * Figma: ARS - Primary, 82:31768.
 */
export function ARSPagination({
  page,
  pageCount,
  onPageChange,
  pages,
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  className,
}: ARSPaginationProps) {
  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.spacer} aria-hidden="true" />

      <Pagination
        page={page}
        pageCount={pageCount}
        pages={pages}
        showFirstLast
        previousLabel="Previous page"
        nextLabel="Next page"
        onPageChange={(p) => onPageChange?.(p)}
      />

      <Menu
        ariaLabel="Items per page"
        align="end"
        items={pageSizeOptions.map<MenuEntry>((n) => ({
          kind: 'item',
          label: `${n} / page`,
          selected: n === pageSize,
          onSelect: () => onPageSizeChange?.(n),
        }))}
        trigger={({ ref, onClick, expanded }) => (
          <button
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            className={styles.pageSize}
            aria-haspopup="menu"
            aria-expanded={expanded}
            aria-label={`Items per page, ${pageSize}`}
            onClick={onClick}
          >
            {pageSize} / page
            <Icon name="CaretDown" size="20px" />
          </button>
        )}
      />
    </div>
  );
}
