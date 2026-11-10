import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import styles from './Tag.module.css';

export interface TagProps {
  label: string;
  /** Icon in the left half; × for a removable tag. */
  icon?: string;
  /** Makes the left half a button (e.g. remove). */
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

/**
 * Tag — icon on the left, text on the right. Matches the Iris UI Kit "Tag"
 * (Component / Tag).
 */
export function Tag({ label, icon = 'X', onAction, actionLabel, className }: TagProps) {
  const glyph = <Icon name={icon} size="16px" />;
  return (
    <span className={cx(styles.tag, className)}>
      {onAction ? (
        <button
          type="button"
          className={cx(styles.action, styles.actionButton)}
          aria-label={actionLabel ?? label}
          onClick={onAction}
        >
          {glyph}
        </button>
      ) : (
        <span className={styles.action} aria-hidden="true">
          {glyph}
        </span>
      )}
      <span className={styles.text}>{label}</span>
    </span>
  );
}
