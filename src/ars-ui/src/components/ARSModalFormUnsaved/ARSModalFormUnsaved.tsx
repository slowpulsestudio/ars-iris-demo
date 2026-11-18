import { useId, type ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import styles from './ARSModalFormUnsaved.module.css';

export interface ARSModalFormUnsavedProps {
  /** Replaces the warning text. */
  message?: ReactNode;
  /**
   * The discard version, for the New object form (Figma 3718:44345): a secondary "Keep my progress" and a danger
   * "Discard changes", which the text names. The default is Figma's 3534:19369, a secondary Cancel and a primary Confirm.
   */
  destructive?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  className?: string;
}

/**
 * ARS_Modal_Form_Unsaved — asks before leaving a form with unsaved changes.
 * Figma: ARS_WebUI2_CRUD, 3534:19369 (not in ARS - Primary); content from
 * ARS_Modal_Form_Unsaved_Content (3534:19266).
 */
export function ARSModalFormUnsaved({
  message,
  destructive = false,
  onClose,
  onCancel,
  onConfirm,
  className,
}: ARSModalFormUnsavedProps) {
  const titleId = useId();
  const confirmLabel = destructive ? 'Discard changes' : 'Confirm';
  const cancelLabel = destructive ? 'Keep my progress' : 'Cancel';
  return (
    <section className={cx(styles.root, destructive && styles.destructive, className)} aria-labelledby={titleId}>
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          Unsaved changes
        </h2>
        <IconButton icon="X" ariaLabel="Close" variant="ghost" size="s" onClick={onClose} />
      </header>
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">
          <Icon name="Warning" size="24px" />
        </span>
        <p className={styles.message}>
          {message ?? (
            <>
              Your unsaved changes will be discarded. To continue, click <strong>{confirmLabel}</strong>. To review your
              changes and save them later, click <strong>{cancelLabel}</strong>.
            </>
          )}
        </p>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? 'danger-outline' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </footer>
    </section>
  );
}
