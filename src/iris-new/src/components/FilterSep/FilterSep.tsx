import { cx } from '@iris/lib/cx.js';
import styles from './FilterSep.module.css';

export type FilterSepOp = 'AND' | 'OR';

export interface FilterSepProps {
  op: FilterSepOp;
  /** `line` runs a rule across the row (between conditions); `chip` is the label alone (beside a nested group). */
  variant?: 'line' | 'chip';
  /** Makes the chip a button that flips AND/OR. */
  onToggle?: () => void;
  className?: string;
}

/** FilterSep — the AND / OR connector. Figma: Iris UI Kit ".Filter, sep" 9722:11737. */
export function FilterSep({ op, variant = 'line', onToggle, className }: FilterSepProps) {
  const next = op === 'AND' ? 'OR' : 'AND';
  const chip = onToggle ? (
    <button
      type="button"
      className={cx(styles.chip, styles.chipButton)}
      onClick={onToggle}
      aria-label={`Joined with ${op}. Switch to ${next}`}
    >
      {op}
    </button>
  ) : (
    <span className={styles.chip}>{op}</span>
  );
  return <div className={cx(styles.root, variant === 'line' && styles.line, className)}>{chip}</div>;
}
