import type { HTMLAttributes } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './TableHeadItem.module.css';

export interface TableHeadItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  label?: string;
  /** Inline padding: 12px for labels, 8px for the select-all checkbox. */
  inset?: 'm' | 's';
}

/** Iris UI Kit ".Table head item" — one column heading. */
export function TableHeadItem({
  icon,
  label,
  inset = 'm',
  className,
  children,
  ...rest
}: TableHeadItemProps) {
  return (
    <div
      role="columnheader"
      className={cx(styles.item, styles[`inset_${inset}`], className)}
      {...rest}
    >
      {icon && <Icon name={icon} size="20px" className={styles.icon} />}
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </div>
  );
}
