import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import styles from './TableCell.module.css';

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Inline padding: 12px for content, 8px for a checkbox, 6px for an icon button. */
  inset?: 'm' | 's' | 'button';
  /** Space between items in the cell. */
  gap?: 'm' | 's';
  /** Right-hand divider; off for the last cell in a row. */
  divider?: boolean;
}

/** Iris UI Kit ".Cell item" — one cell of a table row. */
export function TableCell({
  inset = 'm',
  gap = 'm',
  divider = true,
  className,
  children,
  ...rest
}: TableCellProps) {
  return (
    <div
      role="cell"
      className={cx(
        styles.cell,
        styles[`inset_${inset}`],
        styles[`gap_${gap}`],
        divider && styles.divider,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CellTextProps {
  /** Semi-bold, as used for the name column. */
  strong?: boolean;
  children?: ReactNode;
}

/** Single-line cell text that truncates with an ellipsis. */
export function CellText({ strong = false, children }: CellTextProps) {
  return <span className={cx(styles.text, strong && styles.strong)}>{children}</span>;
}
