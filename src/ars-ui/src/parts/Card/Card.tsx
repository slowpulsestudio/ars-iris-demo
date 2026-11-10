import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import styles from './Card.module.css';

export interface CardProps {
  title: string;
  helper?: string;
  /** Header buttons, e.g. Edit, or Cancel and Save. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** The card frame as the ARS file draws it (the Iris UI Kit has no card component). */
export function Card({ title, helper, actions, children, className }: CardProps) {
  return (
    <section className={cx(styles.card, className)}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          {helper && <p className={styles.helper}>{helper}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
