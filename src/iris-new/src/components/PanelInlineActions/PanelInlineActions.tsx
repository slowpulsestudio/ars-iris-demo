import { cx } from '@iris/lib/cx.js';
import styles from './PanelInlineActions.module.css';

export interface PanelInlineActionsProps {
  onAddCondition?: () => void;
  /** Omit to hide "+New filter group" (the nesting limit is reached). */
  onAddGroup?: () => void;
  className?: string;
}

/** PanelInlineActions — "+New condition" and "+New filter group". Figma: ".Panel, inline actions group" 10233:5581. */
export function PanelInlineActions({ onAddCondition, onAddGroup, className }: PanelInlineActionsProps) {
  return (
    <div className={cx(styles.root, className)}>
      <button type="button" className={styles.action} onClick={onAddCondition}>
        +New condition
      </button>
      {onAddGroup && (
        <button type="button" className={styles.action} onClick={onAddGroup}>
          +New filter group
        </button>
      )}
    </div>
  );
}
