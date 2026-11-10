import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ARSObjectSelected.module.css';

export interface ARSObjectSelectedProps {
  label?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
}

/** ARS_object-selected — an object value in a filter pill, e.g. "Computer". Figma: 2650:24543. */
export function ARSObjectSelected({ label = 'Computer', icon = 'Desktop', onClick, className }: ARSObjectSelectedProps) {
  return (
    <button type="button" className={cx(styles.root, className)} onClick={onClick}>
      <Icon name={icon} size="16px" className={styles.icon} />
      {label}
    </button>
  );
}
