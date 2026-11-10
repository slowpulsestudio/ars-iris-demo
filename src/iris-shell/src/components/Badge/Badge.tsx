import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Iris UI Kit "Strong=True": solid fill. */
  strong?: boolean;
  /** Optional leading icon name. */
  icon?: string;
  children?: ReactNode;
}

/**
 * Badge — short status/category indicator. Matches the Iris UI Kit "Badge"
 * (Component / Badge).
 */
export function Badge({ tone = 'neutral', strong = false, icon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[`tone_${tone}`], strong && styles.strong, className)} {...rest}>
      {icon && <Icon name={icon} size="16px" />}
      <span className={styles.label}>{children}</span>
    </span>
  );
}
