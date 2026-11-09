import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import styles from './ARSTableConfig.module.css';

export interface ARSTableConfigProps {
  onClick?: () => void;
  className?: string;
}

/** ARS_Table_Config — the column-settings button above a table's last column. Figma: 3663:19416. */
export function ARSTableConfig({ onClick, className }: ARSTableConfigProps) {
  return (
    <div className={cx(styles.cell, className)}>
      <IconButton icon="SlidersHorizontal" ariaLabel="Table settings" onClick={onClick} />
    </div>
  );
}
