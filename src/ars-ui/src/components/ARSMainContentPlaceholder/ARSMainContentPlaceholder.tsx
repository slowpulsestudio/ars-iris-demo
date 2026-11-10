import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ARSMainContentPlaceholder.module.css';

export interface ARSMainContentPlaceholderProps {
  className?: string;
}

/** ARS_Main_Content Placeholder — the pink stand-in for a page's main content. Figma: 3429:18447. */
export function ARSMainContentPlaceholder({ className }: ARSMainContentPlaceholderProps) {
  return (
    <div className={cx(styles.root, className)}>
      <Icon name="Swap" size="20px" />
    </div>
  );
}
