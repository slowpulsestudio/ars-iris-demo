import { cx } from '@iris/lib/cx.js';
import styles from './ARSTableRowHeader.module.css';

const LABELS = {
  Users: ['Display Name', 'Status', 'Description', 'Tags', 'Location'],
  Mixed: ['Display Name', 'Object Type', 'Tags', 'Location'],
} as const;

export interface ARSTableRowHeaderProps {
  /** Figma "Property 1". */
  variant?: 'Users' | 'Mixed';
  className?: string;
}

/**
 * ARS_Table_Row_Header — a plain-text column header between two lines.
 * Figma: 2385:56534. Labels line up with the ARS_Row text.
 */
export function ARSTableRowHeader({ variant = 'Users', className }: ARSTableRowHeaderProps) {
  return (
    <div role="row" className={cx(styles.root, styles[`variant_${variant}`], className)}>
      <span aria-hidden="true" />
      {LABELS[variant].map((label) => (
        <span key={label} role="columnheader" className={styles.label}>
          {label}
        </span>
      ))}
    </div>
  );
}
