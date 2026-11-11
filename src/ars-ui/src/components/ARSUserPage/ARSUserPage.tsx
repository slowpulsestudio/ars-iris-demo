import type { MouseEventHandler, ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import type { PanelAction } from '../../parts/ActionPanel/ActionPanel.js';
import { ARSObjectContent } from '../ARSObjectContent/ARSObjectContent.js';
import { ARSUserPageHeader } from '../ARSUserPageHeader/ARSUserPageHeader.js';
import styles from './ARSUserPage.module.css';

export interface ARSUserPageProps {
  title?: string;
  /** Header icon; a user by default. */
  icon?: string;
  objectClass?: string;
  objectName?: string;
  tab?: string;
  onTabChange?: (tab: string) => void;
  /** Another object's tabs (a group's) in place of the user tabs. */
  tabs?: string[];
  tabsLabel?: string;
  /** Replaces the cards beside Object Management. */
  children?: ReactNode;
  actionGroups?: PanelAction[][];
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  onMore?: MouseEventHandler<HTMLElement>;
  onEdit?: () => void;
  onAction?: (label: string) => void;
  className?: string;
}

/** ARS_User_Page — a user's page: header, then tabs, cards and actions. Figma: 3129:8132. */
export function ARSUserPage({
  title,
  icon,
  objectClass,
  objectName,
  tab,
  onTabChange,
  tabs,
  tabsLabel,
  children,
  actionGroups,
  onBack,
  onNextItem,
  onPreviousItem,
  onMore,
  onEdit,
  onAction,
  className,
}: ARSUserPageProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSUserPageHeader
        title={title}
        icon={icon}
        objectClass={objectClass}
        objectName={objectName}
        onBack={onBack}
        onNextItem={onNextItem}
        onPreviousItem={onPreviousItem}
        onMore={onMore}
      />
      <ARSObjectContent
        variant="General"
        tab={tab}
        onTabChange={onTabChange}
        tabs={tabs}
        tabsLabel={tabsLabel}
        actionGroups={actionGroups}
        onEdit={onEdit}
        onAction={onAction}
      >
        {children}
      </ARSObjectContent>
    </div>
  );
}
