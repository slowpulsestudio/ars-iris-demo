import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import styles from './ARSGroupMembershipButtonSelect.module.css';

export type ARSGroupMembershipView = 'Members' | 'Members of';

export interface ARSGroupMembershipButtonSelectProps {
  /** The chosen view: a primary button; the other is secondary. */
  value: ARSGroupMembershipView;
  onChange?: (value: ARSGroupMembershipView) => void;
  className?: string;
}

/**
 * ARS_Group_Membership_Button_Select — two buttons that switch a group's
 * membership table between Members and Members of. Figma: 160:9082
 * (ARS_WebUI2_Groups).
 */
export function ARSGroupMembershipButtonSelect({ value, onChange, className }: ARSGroupMembershipButtonSelectProps) {
  return (
    <div role="group" aria-label="Membership view" className={cx(styles.root, className)}>
      {(['Members', 'Members of'] as const).map((view) => (
        <Button
          key={view}
          variant={view === value ? 'primary' : 'secondary'}
          aria-pressed={view === value}
          onClick={() => onChange?.(view)}
        >
          {view}
        </Button>
      ))}
    </div>
  );
}
