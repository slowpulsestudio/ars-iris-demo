import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { ActionPanel, type PanelAction } from '../../parts/ActionPanel/ActionPanel.js';
import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';
import { ARSUserPageTabs } from '../ARSUserPageTabs/ARSUserPageTabs.js';
import { ObjectTabs } from '../../parts/ObjectTabs/ObjectTabs.js';
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

/** Object Management as Figma draws it for a user. */
export const USER_OBJECT_ACTIONS = (revoke: string): PanelAction[][] => [
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
  /** The selected tab (controlled); without it the tabs follow the variant. */
  tab?: string;
  onTabChange?: (tab: string) => void;
  /** Another object's tabs (a group's) in place of the user tabs; needs `tab`. */
  tabs?: string[];
  tabsLabel?: string;
  /** Replaces the cards beside Object Management. */
  children?: ReactNode;
  /** Replaces the Object Management actions. */
  actionGroups?: PanelAction[][];
  onEdit?: () => void;
  /** Called with the label of the action picked in Object Management. */
  onAction?: (label: string) => void;
  className?: string;
}

/** ARS_Object_Content — a user's tabs, detail cards and Object Management actions. Figma: 2385:56718. */
export function ARSObjectContent({
  variant = 'General',
  tab,
  onTabChange,
  tabs,
  tabsLabel = 'Sections',
  children,
  actionGroups,
  onEdit,
  onAction,
  className,
}: ARSObjectContentProps) {
  const general = variant === 'General';
  return (
    <div className={cx(styles.root, className)}>
      {tabs ? (
        <ObjectTabs tabs={tabs} value={tab} defaultValue={tabs[0]} onChange={onTabChange} ariaLabel={tabsLabel} />
      ) : (
        <ARSUserPageTabs
          key={tab === undefined ? variant : 'controlled'}
          defaultValue={general ? 'General' : 'User Details'}
          value={tab}
          onChange={onTabChange}
        />
      )}
      <div className={styles.content}>
        <div className={styles.cards}>
          {children ??
            (general ? (
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
            ))}
        </div>
        <ActionPanel
          groups={actionGroups ?? USER_OBJECT_ACTIONS(general ? 'Revoke sessions' : 'Revoke Sessions')}
          onAction={onAction}
        />
      </div>
    </div>
  );
}
