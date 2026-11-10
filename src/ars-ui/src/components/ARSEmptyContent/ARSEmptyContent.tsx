import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { ARSHeader, type ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import { ARSTableToolbar, type ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { NoDataIllustration } from '../../parts/NoDataIllustration/NoDataIllustration.js';
import styles from './ARSEmptyContent.module.css';

export interface ARSEmptyContentProps {
  /** ARS_Header; Figma uses the "Customize next to object class" variant. */
  header: ARSHeaderProps;
  /** ARS_Table_Toolbar; Figma uses the "Split" variant. */
  toolbar?: ARSTableToolbarProps;
  /** Empty-state message, e.g. "This Organizational Unit has no objects." */
  message: string;
  /** Secondary Icon + Text button label, e.g. "Add object". */
  actionLabel: string;
  actionIcon?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * ARS_Empty_Content — an object list with no items: ARS_Header,
 * ARS_Table_Toolbar and the "No data" empty state. Figma: 3423:30769.
 */
export function ARSEmptyContent({
  header,
  toolbar,
  message,
  actionLabel,
  actionIcon = 'Plus',
  onAction,
  className,
}: ARSEmptyContentProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSHeader variant="Customize next to object class" {...header} />
      <ARSTableToolbar variant="Split" {...toolbar} />
      <div className={styles.placeholder}>
        <div className={styles.emptyState}>
          <NoDataIllustration />
          <div className={styles.content}>
            <p className={styles.message}>{message}</p>
            <div className={styles.buttons}>
              <Button variant="secondary" iconLead={actionIcon} onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
