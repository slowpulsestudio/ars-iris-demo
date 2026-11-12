import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { ARSHeader, type ARSHeaderProps } from '../../components/ARSHeader/ARSHeader.js';
import { ARSTableToolbar, type ARSTableToolbarProps } from '../../components/ARSTableToolbar/ARSTableToolbar.js';
import styles from './ContentScreen.module.css';

export interface ContentScreenProps {
  header: ARSHeaderProps;
  toolbar?: ARSTableToolbarProps;
  /** Applied-filter pills, in a row between the toolbar and the table. Not drawn in Figma. */
  filters?: ReactNode;
  /** Whether the pill row is open; it opens and closes with a height transition. Defaults to open. */
  filtersOpen?: boolean;
  /** The table, edge to edge. */
  children: ReactNode;
  className?: string;
}

/**
 * The list-screen card shared by ARS_Flat View_User_Content (3423:30755) and
 * Tree_View_AD_Content (4517:19943): ARS_Header and ARS_Table_Toolbar inset
 * xxl, then the table.
 */
export function ContentScreen({ header, toolbar, filters, filtersOpen = true, children, className }: ContentScreenProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSHeader variant="Variant1" {...header} className={cx(styles.inset, header.className)} />
      <ARSTableToolbar variant="Basic" {...toolbar} className={cx(styles.inset, toolbar?.className)} />
      {filters !== undefined && filters !== null && (
        <div className={cx(styles.inset, styles.filters)} data-open={filtersOpen} aria-hidden={!filtersOpen}>
          <div className={styles.filtersInner}>{filters}</div>
        </div>
      )}
      {children}
    </div>
  );
}
