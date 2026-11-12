import type { MouseEventHandler, ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import styles from './ARSFilterArea.module.css';

export interface ARSFilterAreaProps {
  /** The filter pills. */
  children?: ReactNode;
  onAdd?: MouseEventHandler<HTMLElement>;
  onClear?: MouseEventHandler<HTMLElement>;
  className?: string;
}

/**
 * The filter area under the toolbar: the pills, "Add" to add another, and "Clear" at the right.
 * Figma: "filter area" 4145:13713 in ARS_WebUI2_Advanced-Search (ARS - Favorites 4145:13627).
 */
export function ARSFilterArea({ children, onAdd, onClear, className }: ARSFilterAreaProps) {
  return (
    <div className={cx(styles.root, className)} role="group" aria-label="Applied filters">
      <div className={styles.pills}>
        {children}
        <Button variant="ghost" size="s" iconLead="Plus" onClick={onAdd}>
          Add
        </Button>
      </div>
      <Button variant="ghost" size="s" iconLead="XCircle" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
