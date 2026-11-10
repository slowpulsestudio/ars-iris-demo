import type { MouseEvent } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Link } from '@iris/components/Link/Link.js';
import styles from './ARSPageActionPanel.module.css';

export interface ARSPageActionPanelProps {
  /** Called with "Move", "Copy" or "Delete". */
  onAction?: (action: string) => void;
  className?: string;
}

/** ARS_Page_Action panel — Move / Copy and Delete for the object on the page. Figma: 2944:29985. */
export function ARSPageActionPanel({ onAction, className }: ARSPageActionPanelProps) {
  const action = (label: string, tone: 'brand' | 'danger' = 'brand') => (
    <Link
      href="#"
      tone={tone}
      className={styles.action}
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        onAction?.(label);
      }}
    >
      {label}
    </Link>
  );

  return (
    <section className={cx(styles.root, className)}>
      <header className={styles.header}>
        <h3 className={styles.title}>Object Management</h3>
        <p className={styles.helper}>Manage this objects access, location, and restriction to the domain.</p>
      </header>
      <div className={styles.card}>
        {action('Move')}
        {action('Copy')}
      </div>
      <div className={styles.card}>{action('Delete', 'danger')}</div>
    </section>
  );
}
