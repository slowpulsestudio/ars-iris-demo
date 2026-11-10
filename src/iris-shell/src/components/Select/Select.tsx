import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import styles from './Select.module.css';

export interface SelectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Currently selected label. */
  label: string;
  /** Shown in the UI Kit's "Default" state when nothing is selected (`label` empty). */
  placeholder?: string;
  /** Iris UI Kit sizes: Default (28px) and Large (32px). */
  size?: 'default' | 'l';
  /** Error state (red border + `aria-invalid`). */
  invalid?: boolean;
}

/**
 * Select — non-interactive (display-only) form field matching the Iris UI Kit
 * ".Select" (Component / Dropdown). Opens nothing — wire a menu separately when needed.
 */
export function Select({
  label,
  placeholder,
  onClick,
  size = 'default',
  invalid = false,
  className,
  ...rest
}: SelectProps) {
  const empty = !label;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-invalid={invalid || undefined}
      className={cx(styles.trigger, styles[`size_${size}`], empty && styles.empty, invalid && styles.invalid, className)}
      {...rest}
    >
      <span className={styles.label}>{empty ? placeholder : label}</span>
      <Icon name="CaretUpDown" size="16px" className={styles.caret} />
    </button>
  );
}
