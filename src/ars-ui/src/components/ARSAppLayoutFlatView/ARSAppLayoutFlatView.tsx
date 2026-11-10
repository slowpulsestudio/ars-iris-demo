import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { AppHeader, type AppHeaderProps } from '@iris/components/AppHeader/AppHeader.js';
import styles from './ARSAppLayoutFlatView.module.css';

export interface ARSAppLayoutFlatViewProps {
  /** Iris AppHeader (sidebar collapsed in Figma). */
  header: AppHeaderProps;
  /** ARS_Directory_Management_Panel. */
  panel: ReactNode;
  /** Main content, e.g. ARS_Main_Content Placeholder or a list screen. */
  children: ReactNode;
  className?: string;
}

/**
 * ARS_App_Layout_Flat_View — the application layout: Iris AppHeader, then
 * the directory panel beside the main content. Figma: 2385:56316. Also the
 * frame of ARS_Flat_Master (4006:17053) and ARS_Treeview_Master (3367:42088).
 */
export function ARSAppLayoutFlatView({ header, panel, children, className }: ARSAppLayoutFlatViewProps) {
  return (
    <div className={cx(styles.root, className)}>
      <AppHeader {...header} />
      <div className={styles.contentArea}>
        <div className={styles.panel}>{panel}</div>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
