import { useId, type ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import styles from './ModalPanel.module.css';

export interface ModalPanelProps {
  /** Icon shown before the title. */
  icon: string;
  title: string;
  supportingText?: string;
  onClose?: () => void;
  /** Footer buttons, right-aligned. */
  actions: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * The ARS file's 620px modal panel (password reset): title row with icon,
 * bordered header, body, and the Iris UI Kit "Modal-Footer" layout.
 */
export function ModalPanel({
  icon,
  title,
  supportingText,
  onClose,
  actions,
  children,
  className,
  bodyClassName,
}: ModalPanelProps) {
  const titleId = useId();
  return (
    <section className={cx(styles.root, className)} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.titleRow}>
            <Icon name={icon} size="24px" />
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          </div>
          {supportingText && <p className={styles.supporting}>{supportingText}</p>}
        </div>
        <IconButton icon="X" ariaLabel="Close" variant="ghost" size="s" className={styles.close} onClick={onClose} />
      </header>
      <div className={cx(styles.body, bodyClassName)}>{children}</div>
      <footer className={styles.footer}>{actions}</footer>
    </section>
  );
}
