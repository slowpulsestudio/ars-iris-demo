import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Link.module.css';

export type LinkTone = 'brand' | 'danger';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: LinkTone;
  /** Iris UI Kit sizes: Default (14px) and Large (16px). Inherits the surrounding text when unset. */
  size?: 'default' | 'l';
  /** UI Kit "State=Disabled". */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Link — hyperlink matching the Iris UI Kit "Link" (Component / Link).
 */
export function Link({ href, tone = 'brand', size, disabled = false, children, className, ...rest }: LinkProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      className={cx(styles.link, styles[`tone_${tone}`], size && styles[`size_${size}`], className)}
      {...rest}
    >
      {children}
    </a>
  );
}
