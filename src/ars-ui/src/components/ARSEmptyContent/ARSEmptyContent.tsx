import { cx } from '@iris/lib/cx.js';
import { ARSHeader, type ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import { ARSTableToolbar, type ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { EmptyState } from '../../parts/EmptyState/EmptyState.js';
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
 * ARS_Table_Toolbar and the empty state (the Iris one with a Hairline
 * figure, in place of Figma's older "No data" drawing). Figma: 3423:30769.
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
      <EmptyState message={message} actionLabel={actionLabel} actionIcon={actionIcon} onAction={onAction} />
    </div>
  );
}
