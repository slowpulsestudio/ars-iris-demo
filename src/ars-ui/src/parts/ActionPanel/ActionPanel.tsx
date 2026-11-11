import type { MouseEvent } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Link } from '@iris/components/Link/Link.js';
import styles from './ActionPanel.module.css';

export interface PanelAction {
  label: string;
  danger?: boolean;
}

export interface ActionPanelProps {
  /** Each inner list is one bordered card of actions. */
  groups: PanelAction[][];
  /** Called with the action's label. */
  onAction?: (label: string) => void;
  className?: string;
}

/** "Object Management": the object's actions as Iris links in bordered cards. */
export function ActionPanel({ groups, onAction, className }: ActionPanelProps) {
  return (
    <section className={cx(styles.root, className)}>
      <header className={styles.header}>
        <h3 className={styles.title}>Object Management</h3>
        <p className={styles.helper}>Manage this object&apos;s access, location, and restriction to the domain.</p>
      </header>
      {groups.map((group, i) => (
        <div key={i} className={styles.card}>
          {group.map(({ label, danger }) => (
            <Link
              key={label}
              href="#"
              tone={danger ? 'danger' : 'brand'}
              className={styles.action}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                onAction?.(label);
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
