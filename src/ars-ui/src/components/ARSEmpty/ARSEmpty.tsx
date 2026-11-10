import { cx } from '@iris/lib/cx.js';
import { NoDataIllustration } from '../../parts/NoDataIllustration/NoDataIllustration.js';
import styles from './ARSEmpty.module.css';

export interface ARSEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Empty — the main content when no directory or folder is selected. Figma:
 * ARS_WebUI2_CRUD, 1369:31209 (not in ARS - Primary).
 */
export function ARSEmpty({
  title = 'No directory or folder selected.',
  description = 'Choose a directory or folder to display its contents here.',
  className,
}: ARSEmptyProps) {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.emptyState}>
        <NoDataIllustration />
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}
