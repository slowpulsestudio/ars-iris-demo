import type { BadgeTone } from '@iris/components/Badge/Badge.js';
import type { ARSTableRow } from '../components/ARSTable/ARSTable.js';
import type { ARSTreeViewADRow } from '../components/ARSTreeViewADContent/ARSTreeViewADContent.js';

const TONE: Record<string, BadgeTone> = { Active: 'success', Inactive: 'error', Unknown: 'warning' };

type UserSample = [name: string, status: string, description: string, tags: string[], location: string];

/** ARS_Flat View_User_Content (3423:30755) sample rows. */
const FLAT_USERS: UserSample[] = [
  ['Liam Carter', 'Active', 'Leads platform global security.', ['HR', 'Engineering'], 'AD1\\Users'],
  ['Emma Brooks', 'Active', 'Directs platform helpdesk services.', ['Global', 'Helpdesk'], 'Entra'],
  ['Noah Bennett', 'Inactive', 'Oversees platform administration.', ['Platform', 'Security'], 'AD1\\Users'],
  ['Ava Morgan', 'Unknown', 'Leads platform international HR.', ['HR', 'Compliance'], 'AD1\\Users'],
  ['Ethan Hayes', 'Active', 'Manages platform helpdesk support.', ['Security', 'Helpdesk'], 'Entra'],
  ['Mia Foster', 'Active', 'Guides platform administration.', ['Platform', 'Administrator'], 'AD1\\Users'],
  ['Lucas Grant', 'Inactive', 'Coordinates platform HR activities.', ['HR', 'Global'], 'AD1\\DataAdmin'],
  ['Isabella Reed', 'Inactive', 'Leads platform administration.', ['Security', 'Administrator'], 'AD2\\OU1'],
  ['Mason Clarke', 'Active', 'Heads platform HR operations.', ['HR', 'Engineering'], 'AD2\\OU1'],
  ['Lena Foster', 'Active', 'Leads product design and customer experience.', ['Design', 'Marketing'], 'Entra'],
  ['Marcus Chen', 'Active', 'Oversees backend systems and API integrations.', ['Engineering', 'DevOps'], 'AD1\\Users'],
  ['Jamal Rivera', 'Active', 'Manages cloud infrastructure.', ['HR', 'Operations'], 'AD1\\Users'],
  ['Priya Sharma', 'Active', 'Drives data analytics and reporting strategy.', ['Analytics', 'Finance'], 'AD1\\DataAdmin'],
  ['Sofia Nguyen', 'Inactive', 'Coordinates marketing campaigns.', ['Marketing', 'Sales'], 'Entra'],
  ['Elena Dubois', 'Inactive', 'Manages compliance and regulatory processes.', ['Legal', 'Operations'], 'AD1\\DataAdmin'],
];

export const flatUserRows: ARSTableRow[] = FLAT_USERS.map(([name, status, description, tags, location], i) => ({
  id: `user-${i}`,
  name,
  status,
  statusTone: TONE[status],
  description,
  tags,
  location,
}));

type ObjectSample = [name: string, icon: string, objectType: string, description: string];

/** Tree_View_AD_Content (4517:19943) sample rows. */
const AD_OBJECTS: ObjectSample[] = [
  ['Test1', 'Folder', 'Organizational Unit', 'TestOU 1'],
  ['Test2', 'Folder', 'Organizational Unit', 'TestOU 2'],
  ['Operator computer', 'Devices', 'Computer', 'Oversees platform administration.'],
  ['Peter Kim', 'User', 'User', 'Oversees platform administration.'],
  ['Device 001', 'Devices', 'Computer', 'UI/motion designer specializing in micro-interactions and design systems at scale.'],
  ['Elena Vasquez', 'User', 'User', 'Trial user who signed up via referral. Has not logged in for over 60 days.'],
  ['Clara Webb', 'User', 'User', 'Account suspended following repeated policy violations. Access revoked on Apr 2025.'],
  ['Computer 012', 'Devices', 'Computer', 'Trial user who signed up via referral. Has not logged in for over 60 days.'],
  ['Nadia Patel', 'User', 'User', 'Leads platform engineering, oversees infra and security compliance across all regions.'],
  ['Computer 004', 'Devices', 'Computer', 'Manages CI/CD pipelines and cloud cost optimization. AWS certified architect.'],
  ['Oliver Tanaka', 'User', 'User', 'UI/motion designer specializing in micro-interactions and design systems at scale.'],
  ['Nadia Patel', 'User', 'User', 'Leads platform engineering, oversees infra and security compliance across all regions.'],
  ['Elena Vasquez', 'User', 'User', 'Trial user who signed up via referral. Has not logged in for over 60 days.'],
  ['Aron Patel', 'User', 'User', 'Leads platform engineering, oversees infra and security compliance across all regions.'],
  ['Natalie Estevez', 'User', 'User', 'Oversees platform administration.'],
];

export const adObjectRows: ARSTreeViewADRow[] = AD_OBJECTS.map(([name, icon, objectType, description], i) => ({
  id: `object-${i}`,
  name,
  icon,
  objectType,
  description,
}));

export const paging = {
  page: 1,
  pageCount: 154,
  pages: [1, 2, 3, 4, 'ellipsis', 154] as (number | 'ellipsis')[],
  pageSize: 15,
};
