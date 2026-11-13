import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { NoDataIllustration } from '../NoDataIllustration/NoDataIllustration.js';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /** e.g. "This Organizational Unit has no objects." */
  message: string;
  /** Secondary Icon + Text button, e.g. "Add object". */
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * The ARS "No data" empty state: the drawing, a message and a button, centred in the space left.
 * Figma: the "Content Placeholder" of ARS_Empty_Content 3423:30769.
 */
export function EmptyState({ message, actionLabel, actionIcon = 'Plus', onAction, className }: EmptyStateProps) {
  return (
    <div className={cx(styles.placeholder, className)}>
      <div className={styles.emptyState}>
        <NoDataIllustration />
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          {actionLabel && (
            <div className={styles.buttons}>
              <Button variant="secondary" iconLead={actionIcon} onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
