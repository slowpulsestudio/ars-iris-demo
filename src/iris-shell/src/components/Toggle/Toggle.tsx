import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Toggle.module.css';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size' | 'checked'> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Visible label beside the switch. Without one, pass ariaLabel. */
  label?: ReactNode;
  ariaLabel?: string;
  /** Class for the label text. */
  labelClassName?: string;
}

/**
 * Toggle — on/off switch matching the Iris UI Kit "Toggle" (Component / Toggle):
 * 42×20 track, pill knob, brand when on, half opacity when disabled.
 */
export function Toggle({
  checked,
  onChange,
  label,
  ariaLabel,
  labelClassName,
  disabled,
  className,
  ...rest
}: ToggleProps) {
  return (
    <label className={cx(styles.root, disabled && styles.disabled, className)}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        onChange={(e) => onChange?.(e.target.checked)}
        className={styles.input}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} />
      </span>
      {label && <span className={cx(styles.label, labelClassName)}>{label}</span>}
    </label>
  );
}
