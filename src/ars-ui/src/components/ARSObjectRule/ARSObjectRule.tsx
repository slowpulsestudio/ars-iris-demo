import { cx } from '@iris/lib/cx.js';
import styles from './ARSObjectRule.module.css';

export type ARSObjectRuleVariant = 'Default' | 'text';

export interface ARSObjectRuleProps {
  label?: string;
  /** Figma "text" shows the rule as plain text, without the grey chip. */
  variant?: ARSObjectRuleVariant;
  onClick?: () => void;
  className?: string;
}

/** ARS_object-rule — the rule word in a filter pill, e.g. "is". Figma: 2650:24550. */
export function ARSObjectRule({ label, variant = 'Default', onClick, className }: ARSObjectRuleProps) {
  if (variant === 'text') {
    return <span className={cx(styles.root, styles.text, className)}>{label ?? 'text'}</span>;
  }
  return (
    <button type="button" className={cx(styles.root, styles.chip, className)} onClick={onClick}>
      {label ?? 'is'}
    </button>
  );
}
