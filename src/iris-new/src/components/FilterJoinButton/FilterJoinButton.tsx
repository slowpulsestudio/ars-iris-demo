import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@iris/lib/cx.js';
import styles from './FilterJoinButton.module.css';

export interface FilterJoinButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  op: 'AND' | 'OR';
}

/** FilterJoinButton — "+AND" / "+OR": adds another filter group. Figma: Iris UI Kit ".And" 9722:11499. */
export function FilterJoinButton({ op, className, type = 'button', ...rest }: FilterJoinButtonProps) {
  return (
    <button type={type} className={cx(styles.root, className)} {...rest}>
      +{op}
    </button>
  );
}
