import { ObjectTabs } from '../../parts/ObjectTabs/ObjectTabs.js';

export const PAGE_TABS = ['Overview', 'Properties', 'Managed By (2)', 'Memberships (8)', 'Membership Approval', 'History'];

export interface ARSPageTabsProps {
  value?: string;
  onChange?: (tab: string) => void;
  className?: string;
}

/** ARS_Page_Tabs — the tabs on a group's page. Figma: 2944:30035. */
export function ARSPageTabs(props: ARSPageTabsProps) {
  return <ObjectTabs {...props} tabs={PAGE_TABS} defaultValue="Properties" ariaLabel="Group sections" />;
}
