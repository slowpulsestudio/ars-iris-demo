import { cx } from '@iris/lib/cx.js';
import { ActionPanel, type PanelAction } from '../../parts/ActionPanel/ActionPanel.js';
import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';
import { ARSUserPageTabs } from '../ARSUserPageTabs/ARSUserPageTabs.js';
import { ARSUsersContactInfoCard } from '../ARSUsersContactInfoCard/ARSUsersContactInfoCard.js';
import { ARSUsersJobInfoCard } from '../ARSUsersJobInfoCard/ARSUsersJobInfoCard.js';
import styles from './ARSObjectContent.module.css';

export type ARSObjectContentVariant = 'General' | 'Variant3';

// The Properties card here comes from outside this Figma file and has its own rows.
const PROPERTIES_ROWS: DetailsRow[] = [
  { label: 'First name', value: 'Markus' },
  { label: 'Last name', value: 'Kim' },
  { label: 'Display name', value: 'MKim' },
  { label: 'User principal name', value: 'MKim@Entra1' },
  { label: 'Authorization information' },
  { label: 'Description', value: 'Duis aute irure dolor in reprehenderit in voluptate velit esse eu fugiat nulla pariatur.' },
];

const actions = (revoke: string): PanelAction[][] => [
  [{ label: 'Reset password' }, { label: 'Reset Entra ID MFA' }, { label: revoke }],
  [{ label: 'Move' }, { label: 'Copy' }],
  [
    { label: 'Deactivate', danger: true },
    { label: 'Deprovision', danger: true },
    { label: 'Delete', danger: true },
  ],
];

export interface ARSObjectContentProps {
  /** Figma "Variant": General tab, or Variant3 (User Details tab). */
  variant?: ARSObjectContentVariant;
  onEdit?: () => void;
  /** Called with the label of the action picked in Object Management. */
  onAction?: (label: string) => void;
  className?: string;
}

/** ARS_Object_Content — a user's tabs, detail cards and Object Management actions. Figma: 2385:56718. */
export function ARSObjectContent({ variant = 'General', onEdit, onAction, className }: ARSObjectContentProps) {
  const general = variant === 'General';
  return (
    <div className={cx(styles.root, className)}>
      <ARSUserPageTabs key={variant} defaultValue={general ? 'General' : 'User Details'} />
      <div className={styles.content}>
        <div className={styles.cards}>
          {general ? (
            <DetailsCard
              title="Properties"
              helper="Manage identity and display names."
              editing={false}
              rows={PROPERTIES_ROWS}
              onEdit={onEdit}
            />
          ) : (
            <>
              <ARSUsersContactInfoCard onEdit={onEdit} />
              <ARSUsersJobInfoCard onEdit={onEdit} />
            </>
          )}
        </div>
        <ActionPanel groups={actions(general ? 'Revoke sessions' : 'Revoke Sessions')} onAction={onAction} />
      </div>
    </div>
  );
}
