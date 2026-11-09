import type { Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import {
  getPaginationRange,
  type PaginationEllipsis,
} from '@iris/components/Pagination/Pagination.js';
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

interface StepButtonProps {
  icon: string;
  label: string;
  target: number;
  blocked: boolean;
  onPageChange?: (page: number) => void;
}

function StepButton({ icon, label, target, blocked, onPageChange }: StepButtonProps) {
  return (
    <button
      type="button"
      className={styles.item}
      aria-label={label}
      aria-disabled={blocked || undefined}
      onClick={() => {
        if (!blocked) onPageChange?.(target);
      }}
    >
      <Icon name={icon} size="16px" />
    </button>
  );
}

/**
 * ARS_Pagination — first/previous, page numbers, next/last, and the
 * items-per-page button. Figma: ARS - Primary, 82:31768.
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
  const current = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
  const slots = pages ?? getPaginationRange(current, pageCount);
  const atStart = current <= 1;
  const atEnd = current >= pageCount;

  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.spacer} aria-hidden="true" />

      <nav className={styles.pages} aria-label="Pagination">
        <StepButton icon="CaretDoubleLeft" label="First page" target={1} blocked={atStart} onPageChange={onPageChange} />
        <StepButton icon="CaretLeft" label="Previous page" target={current - 1} blocked={atStart} onPageChange={onPageChange} />
        {slots.map((slot, i) =>
          slot === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={slot}
              type="button"
              className={cx(styles.item, slot === current && styles.current)}
              aria-label={`Page ${slot}`}
              aria-current={slot === current ? 'page' : undefined}
              onClick={() => onPageChange?.(slot)}
            >
              {slot}
            </button>
          ),
        )}
        <StepButton icon="CaretRight" label="Next page" target={current + 1} blocked={atEnd} onPageChange={onPageChange} />
        <StepButton icon="CaretDoubleRight" label="Last page" target={pageCount} blocked={atEnd} onPageChange={onPageChange} />
      </nav>

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
