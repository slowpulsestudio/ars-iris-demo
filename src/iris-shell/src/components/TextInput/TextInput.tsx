import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import styles from './TextInput.module.css';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Icon name to render at the start. */
  iconLead?: string;
  /** Icon name to render at the end. */
  iconTrail?: string;
  /** Iris UI Kit sizes: Default (28px) and Large (32px). */
  size?: 'default' | 'l';
  /** Render the error state (red border + `aria-invalid`). */
  invalid?: boolean;
}

/**
 * TextInput — single-line text field. Matches the Iris UI Kit ".Input"
 * (Component / Text input): empty, filled, focus, error, disabled, read-only.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { iconLead, iconTrail, size = 'default', invalid = false, type = 'text', className, id, ...rest },
  ref,
) {
  return (
    <div
      className={cx(
        styles.wrap,
        styles[`size_${size}`],
        invalid && styles.invalid,
        className,
      )}
    >
      {iconLead && (
        <span className={styles.icon}>
          <Icon name={iconLead} size="20px" />
        </span>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={invalid || undefined}
        className={styles.input}
        {...rest}
      />
      {iconTrail && (
        <span className={cx(styles.icon, styles.iconTrail)}>
          <Icon name={iconTrail} size="20px" />
        </span>
      )}
    </div>
  );
});
