import { useId } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import styles from './ModalMessage.module.css';

export interface ModalMessageProps {
  tone: 'error' | 'success';
  icon: string;
  title: string;
  value: string;
  type?: 'text' | 'password';
  /** Accessible name for the field (Figma shows no label). */
  inputLabel: string;
  message: string;
  className?: string;
}

/**
 * Modal content from the ARS file: featured icon, a bold line, a field and its
 * message (ARS_Modal_Content_Delete, ARS_Modal_Content_Success).
 */
export function ModalMessage({ tone, icon, title, value, type, inputLabel, message, className }: ModalMessageProps) {
  const messageId = useId();
  return (
    <div className={cx(styles.root, className)}>
      <span className={cx(styles.icon, styles[tone])} aria-hidden="true">
        <Icon name={icon} size="24px" />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <div className={styles.form}>
          <TextInput
            type={type}
            defaultValue={value}
            aria-label={inputLabel}
            aria-describedby={messageId}
            className={styles.input}
          />
          <p id={messageId} className={styles.message}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
