import { cx } from '@iris/lib/cx.js';
import styles from './ARSTableHeader.module.css';

export interface ARSTableHeaderProps {
  title: string;
  className?: string;
}

/** ARS_Table_Header — the title above a table, e.g. the OU name. Figma: 3368:12193. */
export function ARSTableHeader({ title, className }: ARSTableHeaderProps) {
  return (
    <div className={cx(styles.root, className)}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
