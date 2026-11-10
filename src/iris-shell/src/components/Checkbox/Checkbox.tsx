import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  /** Iris UI Kit sizes: small (16px box) and medium (20px box). */
  size?: 'small' | 'medium';
  /** Visible label beside the box. */
  label?: ReactNode;
}

/**
 * Checkbox — controlled tri-state checkbox. Matches the Iris UI Kit
 * "Checkbox" (Component / Checkbox).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked = false, indeterminate = false, onChange, ariaLabel, size = 'small', label, className, ...rest },
  ref,
) {
  const control = (
    <span className={cx(styles.wrap, styles[`size_${size}`], !label && className)}>
      <input
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as { current: HTMLInputElement | null }).current = el;
        }}
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        onChange={(e) => onChange?.(e.target.checked)}
        className={styles.input}
        {...rest}
      />
      <span
        className={cx(
          styles.box,
          checked && styles.checked,
          indeterminate && styles.indeterminate,
        )}
        aria-hidden="true"
      >
        {indeterminate ? (
          <svg viewBox="0 0 16 16" className={styles.mark}>
            <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className={styles.mark}>
            <path
              className={styles.checkPath}
              d="M3.5 8.5l3 3 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </span>
    </span>
  );

  if (!label) return control;
  return (
    <label className={cx(styles.field, styles[`field_${size}`], className)}>
      {control}
      <span className={styles.label}>{label}</span>
    </label>
  );
});
