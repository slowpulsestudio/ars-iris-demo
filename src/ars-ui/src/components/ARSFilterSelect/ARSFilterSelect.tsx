import { cx } from '@iris/lib/cx.js';
import { ARSFilterRemove } from '../ARSFilterRemove/ARSFilterRemove.js';
import { ARSObjectRule } from '../ARSObjectRule/ARSObjectRule.js';
import { ARSObjectSelected } from '../ARSObjectSelected/ARSObjectSelected.js';
import styles from './ARSFilterSelect.module.css';

export type ARSFilterSelectPart =
  | { kind: 'field'; label: string }
  | { kind: 'rule'; label: string }
  | { kind: 'object'; label: string; icon: string };

export interface ARSFilterSelectProps {
  /** What follows the ×, in order: the field name, rule words and selected objects. */
  parts: ARSFilterSelectPart[];
  onRemove?: () => void;
  className?: string;
}

/** ARS_filter-select — a filter pill: × then e.g. "Object Type is Computer". Figma: 2650:24519. */
export function ARSFilterSelect({ parts, onRemove, className }: ARSFilterSelectProps) {
  return (
    <span className={cx(styles.root, className)}>
      <ARSFilterRemove onRemove={onRemove} />
      <span className={styles.text}>
        {parts.map((part, i) =>
          part.kind === 'field' ? (
            <span key={i} className={styles.field}>
              {part.label}
            </span>
          ) : part.kind === 'rule' ? (
            <ARSObjectRule key={i} label={part.label} />
          ) : (
            <ARSObjectSelected key={i} label={part.label} icon={part.icon} />
          ),
        )}
      </span>
    </span>
  );
}
