import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ARSFilterTag.module.css';

export interface ARSFilterTagProps {
  /** The field, e.g. "Object type". */
  field: string;
  /** The rule word, e.g. "is". */
  rule: string;
  /** The chosen values. The first `maxShown` are listed; the rest are counted in the badge. */
  values: string[];
  maxShown?: number;
  /** Further conditions the pill stands for; counted in the badge with the values past `maxShown`. */
  extra?: number;
  /** Makes the field, rule and values one button that edits the filter. */
  onEdit?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/**
 * ARS_Filter_Tag — a filter pill: field, rule, values with a "+3" count, then ×.
 * Figma: ARS_Filter_Tag 2099:18646 in ARS_WebUI2_Advanced-Search (used in the Favorites filter area, 4145:13715).
 */
export function ARSFilterTag({ field, rule, values, maxShown = 2, extra = 0, onEdit, onRemove, removeLabel = `Remove ${field} filter`, className }: ARSFilterTagProps) {
  const shown = values.slice(0, maxShown).join(', ');
  const more = Math.max(0, values.length - maxShown) + extra;
  const body = (
    <>
      <span className={styles.field}>{field}</span>
      <span className={styles.rule}>{rule}</span>
      <span className={styles.values}>{shown}</span>
      {more > 0 && <span className={styles.badge}>+{more}</span>}
    </>
  );
  return (
    <span className={cx(styles.root, className)}>
      {onEdit ? (
        <button type="button" className={cx(styles.text, styles.button)} onClick={onEdit}>
          {body}
        </button>
      ) : (
        <span className={styles.text}>{body}</span>
      )}
      <button type="button" className={styles.remove} aria-label={removeLabel} onClick={onRemove}>
        <Icon name="X" size="16px" />
      </button>
    </span>
  );
}
