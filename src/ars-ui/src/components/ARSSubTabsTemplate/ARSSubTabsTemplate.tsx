import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { ObjectTabs } from '../../parts/ObjectTabs/ObjectTabs.js';
import { PageHeader } from '../../parts/PageHeader/PageHeader.js';
import { SearchInput } from '../../parts/SearchInput/SearchInput.js';
import { SubTabs } from '../../parts/SubTabs/SubTabs.js';
import { ARSMainContentPlaceholder } from '../ARSMainContentPlaceholder/ARSMainContentPlaceholder.js';
import styles from './ARSSubTabsTemplate.module.css';

const GROUP_TABS = [
  'Overview',
  'General',
  'Ownership',
  'Memberships',
  'Managed units',
  'Roles/access templates',
  'Object details',
  'History',
];

const MEMBER_TABS = [
  { label: 'All', icon: 'UsersFour' },
  { label: 'Active Tab', icon: 'Users' },
  { label: 'Secondary tab', icon: 'UserGear' },
];

export interface ARSSubTabsTemplateProps {
  onAddMember?: () => void;
  onSearchChange?: (value: string) => void;
  /** The members area; Figma shows the pink placeholder. */
  children?: ReactNode;
  className?: string;
}

/**
 * ARS_Sub_Tabs_Template — a group page on its Memberships tab: header, tabs,
 * sub-tabs with search and Add member, then the content. Figma: 4503:19905.
 */
export function ARSSubTabsTemplate({ onAddMember, onSearchChange, children, className }: ARSSubTabsTemplateProps) {
  return (
    <div className={cx(styles.root, className)}>
      <PageHeader title="Security Users" icon="UsersThree" objectClass="User" objectName="Entra1" more />
      <div className={styles.object}>
        <ObjectTabs tabs={GROUP_TABS} defaultValue="Memberships" ariaLabel="Group sections" />
        <div className={styles.members}>
          <div className={styles.toolbar}>
            <div className={styles.lhs}>
              <SubTabs tabs={MEMBER_TABS} defaultValue="Active Tab" ariaLabel="Members" />
              <span className={styles.divider} aria-hidden="true" />
              <SearchInput placeholder="Search all members of ..." onChange={onSearchChange} className={styles.search} />
            </div>
            <Button iconLead="Plus" onClick={onAddMember}>
              Add member
            </Button>
          </div>
          {children ?? <ARSMainContentPlaceholder className={styles.placeholder} />}
        </div>
      </div>
    </div>
  );
}
