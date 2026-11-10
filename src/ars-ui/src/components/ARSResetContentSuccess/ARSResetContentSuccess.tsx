import { useId } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { PasswordInput } from '../../parts/PasswordInput/PasswordInput.js';
import styles from './ARSResetContentSuccess.module.css';

export type ARSResetContentSuccessVariant = 'Default' | 'Copied';

export interface ARSResetContentSuccessProps {
  /** Figma "Property 1": Default, or Copied (the copy icon turns into a check). */
  variant?: ARSResetContentSuccessVariant;
  /** The temporary password. */
  password?: string;
  className?: string;
}

/**
 * Reset_Content success — the reset password, ready to copy or reveal.
 * Figma: 4486:19024.
 */
export function ARSResetContentSuccess({ variant = 'Default', password = 'Temp123', className }: ARSResetContentSuccessProps) {
  const messageId = useId();
  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name="CheckCircle" size="24px" />
      </span>
      <div className={styles.content}>
        <p className={styles.title}>Password has been reset successfully.</p>
        <PasswordInput
          copyable
          copied={variant === 'Copied'}
          readOnly
          defaultValue={password}
          aria-label="Temporary password"
          aria-describedby={messageId}
          className={styles.field}
        />
        <p id={messageId} className={styles.message}>
          Provide this temporary password to the user, so they can sign in.
        </p>
      </div>
    </div>
  );
}
