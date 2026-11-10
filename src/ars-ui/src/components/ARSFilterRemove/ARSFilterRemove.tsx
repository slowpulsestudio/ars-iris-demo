import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ARSFilterRemove.module.css';

export interface ARSFilterRemoveProps {
  onRemove?: () => void;
  ariaLabel?: string;
  className?: string;
}

/** ARS_filter-remove — the × at the start of a filter pill. Figma: 2650:24557. */
export function ARSFilterRemove({ onRemove, ariaLabel = 'Remove filter', className }: ARSFilterRemoveProps) {
  return (
    <button type="button" className={cx(styles.root, className)} aria-label={ariaLabel} onClick={onRemove}>
      <Icon name="X" size="16px" />
    </button>
  );
}
