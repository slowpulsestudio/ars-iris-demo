import { useEffect, useState, type Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { TextInput, type TextInputProps } from '@iris/components/TextInput/TextInput.js';
import styles from './PasswordInput.module.css';

export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'iconTrail'> {
  /** Shows the copy button (Figma "Editing/Copy"). */
  copyable?: boolean;
  /** Shows the copied check (Figma "Copied"); copying also shows it briefly. */
  copied?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Iris TextInput for passwords with the ARS file's trailing controls: copy
 * (optional) and show / hide.
 */
export function PasswordInput({ copyable = false, copied = false, className, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [value, setValue] = useState(String(rest.defaultValue ?? ''));

  useEffect(() => {
    if (!justCopied) return undefined;
    const timer = setTimeout(() => setJustCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [justCopied]);

  const showCopied = copied || justCopied;

  return (
    <div className={cx(styles.root, className)}>
      <TextInput
        {...rest}
        type={visible ? 'text' : 'password'}
        onChange={(e) => {
          setValue(e.target.value);
          rest.onChange?.(e);
        }}
        className={cx(styles.input, copyable && styles.twoControls)}
      />
      <span className={styles.controls}>
        {copyable && (
          <button
            type="button"
            className={cx(styles.control, showCopied && styles.copied)}
            aria-label={showCopied ? 'Copied' : 'Copy password'}
            onClick={() => {
              void navigator.clipboard?.writeText(rest.value !== undefined ? String(rest.value) : value);
              setJustCopied(true);
            }}
          >
            <Icon name={showCopied ? 'CheckCircle' : 'Copy'} size="20px" />
          </button>
        )}
        <button
          type="button"
          className={styles.control}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? 'EyeClosed' : 'Eye'} size="20px" />
        </button>
      </span>
    </div>
  );
}
