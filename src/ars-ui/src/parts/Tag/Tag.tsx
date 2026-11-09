import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
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

/** Iris UI Kit "Tag" — icon on the left, text on the right. */
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

export interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
}

/** A row of removable tags, as in the ARS table's Tags column. */
export function TagList({ tags, onRemove }: TagListProps) {
  return (
    <span className={styles.list}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          onAction={onRemove ? () => onRemove(tag) : undefined}
          actionLabel={`Remove ${tag}`}
        />
      ))}
    </span>
  );
}
