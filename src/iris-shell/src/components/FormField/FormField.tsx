import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { useShake } from '../../lib/useShake.js';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  /** Tooltip text on the info icon. */
  helperText?: string;
  /** Help message below the control (UI Kit feedback "Help"). */
  help?: string;
  /** Warning message below the control (UI Kit feedback "Warning"). */
  warning?: string;
  /** Renders below the control; sets invalid. */
  error?: string;
  /** Right-aligned count in the label row, e.g. "0/100". */
  count?: string;
  /** Increment to replay the p12 error shake on the control. Only shakes
   *  while the field currently has an error. */
  shakeTrigger?: number;
  /** Exactly one form control. */
  children: ReactNode;
  className?: string;
}

/**
 * FormField — wraps a single control with a label, required asterisk,
 * optional helper/info text, and an error message slot. The child control
 * receives the generated `id`, `aria-invalid`, and `aria-describedby` so
 * screen readers connect the pieces correctly.
 *
 * Usage:
 *   <FormField label="First name" required error={errors.firstName}>
 *     <TextInput value={...} onChange={...} />
 *   </FormField>
 */
export function FormField({
  label,
  required,
  helperText,
  help,
  warning,
  error,
  count,
  shakeTrigger,
  children,
  className,
}: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-msg`;
  const hasError = Boolean(error);
  // The UI Kit shows one feedback message at a time.
  const message = error ?? warning ?? help;
  const messageTone = error ? styles.error : warning ? styles.warning : styles.help;
  const [shakeRef, shake] = useShake<HTMLDivElement>();

  // Replay the shake when `shakeTrigger` changes while this field has an
  // error — so only the invalid fields shake, not the whole form.
  const prevTrigger = useRef(0);
  useEffect(() => {
    if (shakeTrigger !== undefined && shakeTrigger !== prevTrigger.current) {
      prevTrigger.current = shakeTrigger;
      if (hasError) shake();
    }
  }, [shakeTrigger, hasError, shake]);

  // Inject id / aria-* onto the single child control.
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        invalid: hasError || (children.props as Record<string, unknown>).invalid,
        'aria-describedby': message
          ? messageId
          : (children.props as Record<string, unknown>)['aria-describedby'],
        'aria-required':
          required || (children.props as Record<string, unknown>)['aria-required'],
      })
    : children;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        <span>{label}</span>
        {required && (
          <span aria-hidden="true" className={styles.required}>
            (Required)
          </span>
        )}
        {helperText && (
          <Tooltip label={helperText}>
            <span
              className={styles.info}
              role="img"
              aria-label="More info"
              tabIndex={0}
            >
              <Icon name="Info" size="20px" />
            </span>
          </Tooltip>
        )}
        {count && <span className={styles.count}>{count}</span>}
      </label>
      <div className={styles.content}>
        <div ref={shakeRef} className={styles.control}>
          {control}
        </div>
        {message && (
          <p id={messageId} className={cx(styles.message, messageTone)} role={hasError ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
