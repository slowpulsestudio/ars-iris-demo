import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './Tag.module.css';

export interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

/** Iris UI Kit "Tag" — a removable label: × on the left, text on the right. */
export function Tag({ label, onRemove, className }: TagProps) {
  return (
    <span className={cx(styles.tag, className)}>
      <button
        type="button"
        className={styles.remove}
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <Icon name="X" size="16px" />
      </button>
      <span className={styles.text}>{label}</span>
    </span>
  );
}

export interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
}

/** A row of tags, as in the ARS table's Tags column. */
export function TagList({ tags, onRemove }: TagListProps) {
  return (
    <span className={styles.list}>
      {tags.map((tag) => (
        <Tag key={tag} label={tag} onRemove={onRemove ? () => onRemove(tag) : undefined} />
      ))}
    </span>
  );
}
