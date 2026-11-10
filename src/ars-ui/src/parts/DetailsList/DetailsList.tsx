import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import styles from './DetailsList.module.css';

export interface DetailsRow {
  label: string;
  value?: ReactNode;
}

export interface DetailsListProps {
  rows: DetailsRow[];
  /** Figma's label column width in px (no token): 160 on user cards, 130 on group cards. */
  labelWidth?: number;
  className?: string;
}

/** Label / value rows, as on the ARS read-mode cards. */
export function DetailsList({ rows, labelWidth = 160, className }: DetailsListProps) {
  return (
    <dl className={cx(styles.rows, className)} style={{ '--label-width': `${labelWidth}px` } as CSSProperties}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
