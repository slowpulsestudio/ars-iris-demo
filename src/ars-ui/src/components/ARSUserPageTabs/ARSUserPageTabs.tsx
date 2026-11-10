import { ObjectTabs } from '../../parts/ObjectTabs/ObjectTabs.js';

export const USER_PAGE_TABS = [
  'Overview',
  'General',
  'User Details',
  'Account',
  'Connections',
  'Memberships (8)',
  'Managed Units',
  'Roles',
  'Authorization',
  'Object',
  'History',
];

export interface ARSUserPageTabsProps {
  /** The tab selected at first; Figma shows General. */
  defaultValue?: string;
  value?: string;
  onChange?: (tab: string) => void;
  className?: string;
}

/** ARS_User_Page_Tabs — the tabs on a user's page. Figma: 3598:46761. */
export function ARSUserPageTabs({ defaultValue = 'General', ...props }: ARSUserPageTabsProps) {
  return <ObjectTabs {...props} tabs={USER_PAGE_TABS} defaultValue={defaultValue} ariaLabel="User sections" />;
}
