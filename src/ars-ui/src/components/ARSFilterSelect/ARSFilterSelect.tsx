import { cx } from '@iris/lib/cx.js';
import { ARSFilterRemove } from '../ARSFilterRemove/ARSFilterRemove.js';
import { ARSObjectRule } from '../ARSObjectRule/ARSObjectRule.js';
import { ARSObjectSelected } from '../ARSObjectSelected/ARSObjectSelected.js';
import styles from './ARSFilterSelect.module.css';

export type ARSFilterSelectPart =
  | { kind: 'field'; label: string }
  /** `plain` is Figma's text-only rule, e.g. the "and" between two dates. */
  | { kind: 'rule'; label: string; plain?: boolean }
  | { kind: 'object'; label: string; icon: string };

export interface ARSFilterSelectProps {
  /** What follows the ×, in order: the field name, rule words and selected objects. */
  parts: ARSFilterSelectPart[];
  onRemove?: () => void;
  /** Makes each part a button that edits the filter. */
  onEdit?: () => void;
  removeLabel?: string;
  className?: string;
}

/** ARS_filter-select — a filter pill: × then e.g. "Object Type is Computer". Figma: 2650:24519 (in ARS_WebUI2_Advanced-Search 4145:59397). */
export function ARSFilterSelect({ parts, onRemove, onEdit, removeLabel, className }: ARSFilterSelectProps) {
  return (
    <span className={cx(styles.root, className)}>
      <ARSFilterRemove onRemove={onRemove} ariaLabel={removeLabel} />
      <span className={styles.text}>
        {parts.map((part, i) =>
          part.kind === 'field' ? (
            onEdit ? (
              <button key={i} type="button" className={cx(styles.field, styles.fieldButton)} onClick={onEdit}>
                {part.label}
              </button>
            ) : (
              <span key={i} className={styles.field}>
                {part.label}
              </span>
            )
          ) : part.kind === 'rule' ? (
            <ARSObjectRule key={i} label={part.label} variant={part.plain ? 'text' : 'Default'} onClick={onEdit} />
          ) : (
            <ARSObjectSelected key={i} label={part.label} icon={part.icon} onClick={onEdit} />
          ),
        )}
      </span>
    </span>
  );
}
