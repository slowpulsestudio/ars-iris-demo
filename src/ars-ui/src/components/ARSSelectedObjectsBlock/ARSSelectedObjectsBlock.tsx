import { Tag } from '@iris/components/Tag/Tag.js';
import { cx } from '@iris/lib/cx.js';
import styles from './ARSSelectedObjectsBlock.module.css';

export interface ARSSelectedObjectsBlockItem {
  id: string;
  label: string;
}

export interface ARSSelectedObjectsBlockProps {
  items: ARSSelectedObjectsBlockItem[];
  /** Makes each tag removable. */
  onRemove?: (id: string) => void;
  className?: string;
}

/**
 * Selected objects block — the objects being acted on, as removable Iris Tags
 * under a count. Figma: 2224:16697 (ARS_WebUI2_Move_Browse_Objects).
 */
export function ARSSelectedObjectsBlock({ items, onRemove, className }: ARSSelectedObjectsBlockProps) {
  return (
    <section className={cx(styles.block, className)} aria-label="Selected objects">
      <p className={styles.title}>
        {items.length} {items.length === 1 ? 'object' : 'objects'} selected
      </p>
      <ul className={styles.tags}>
        {items.map((item) => (
          <li key={item.id}>
            <Tag
              label={item.label}
              onAction={onRemove && (() => onRemove(item.id))}
              actionLabel={`Remove ${item.label}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
