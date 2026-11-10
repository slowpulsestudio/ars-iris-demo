import { Tag } from '@iris/components/Tag/Tag.js';
import styles from './TagList.module.css';

export interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
}

/** A row of removable Iris tags, as in the ARS table's Tags column. */
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
