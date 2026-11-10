import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import styles from './TableHeadItem.module.css';

export interface TableHeadItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon before the heading. */
  icon?: string;
  label?: string;
  /** Icon after the heading (UI Kit "Icon RHS"). */
  iconTrail?: string;
  /** Inline padding: 12px for headings, 8px for a select-all checkbox. */
  inset?: 'm' | 's';
}

/**
 * TableHeadItem — one column heading. Matches the Iris UI Kit
 * ".Table head item" (Component / Table): 36px tall, semibold label.
 */
export function TableHeadItem({ icon, label, iconTrail, inset = 'm', className, children, ...rest }: TableHeadItemProps) {
  return (
    <div role="columnheader" className={cx(styles.item, styles[`inset_${inset}`], className)} {...rest}>
      {icon && <Icon name={icon} size="20px" className={styles.icon} />}
      {label && <span className={styles.label}>{label}</span>}
      {children}
      {iconTrail && <Icon name={iconTrail} size="20px" className={styles.icon} />}
    </div>
  );
}
