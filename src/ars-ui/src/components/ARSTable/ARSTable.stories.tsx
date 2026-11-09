import type { BadgeTone } from '@iris/components/Badge/Badge.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTable, type ARSTableRow } from './ARSTable.js';

const meta = {
  title: 'ARS/ARS_Table',
  component: ARSTable,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Table · ARS - Primary · 99:30760. Rows, statuses and tags are the Figma sample data. In the filter variant Figma places an extra card icon after "Display name", shifting the later headings right.',
      },
    },
  },
} satisfies Meta<typeof ARSTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONE: Record<string, BadgeTone> = { Active: 'success', Inactive: 'error', Unknown: 'warning' };

type UserSample = [name: string, status: string, description: string, tags: string[], location: string, tone?: BadgeTone];

/** Figma sample rows for the Default and filter variants (the last two show "Inactive" in green). */
const USERS: UserSample[] = [
  ['Liam Carter', 'Active', 'Leads platform global security.', ['HR', 'Engineering'], 'AD1\\Users'],
  ['Emma Brooks', 'Active', 'Directs platform helpdesk services.', ['Global', 'Helpdesk'], 'AD1\\Users'],
  ['Noah Bennett', 'Inactive', 'Oversees platform administration.', ['Platform', 'Security'], 'AD1\\Users'],
  ['Ava Morgan', 'Unknown', 'Leads platform international HR.', ['HR', 'Compliance'], 'AD1\\Users'],
  ['Ethan Hayes', 'Active', 'Manages platform helpdesk support.', ['Security', 'Helpdesk'], 'AD1\\Users'],
  ['Mia Foster', 'Active', 'Guides platform administration.', ['Platform', 'Administrator'], 'AD1\\Users'],
  ['Lucas Grant', 'Inactive', 'Coordinates platform HR activities.', ['HR', 'Global'], 'AD1\\Users'],
  ['Isabella Reed', 'Inactive', 'Leads platform administration.', ['Security', 'Administrator'], 'AD2\\Users'],
  ['Mason Clarke', 'Active', 'Heads platform HR operations.', ['HR', 'Engineering'], 'AD2\\Users'],
  ['Lena Foster', 'Active', 'Leads product design and customer experience.', ['Design', 'Marketing'], 'Entra'],
  ['Lena Foster', 'Active', 'Leads product design and customer experience.', ['Design', 'Marketing'], 'Entra'],
  ['Jamal Rivera', 'Active', 'Manages cloud infrastructure.', ['HR', 'Operations'], 'NetSec\\Admins'],
  ['Jamal Rivera', 'Active', 'Manages cloud infrastructure.', ['HR', 'Operations'], 'NetSec\\Admins'],
  ['Sofia Nguyen', 'Inactive', 'Coordinates marketing campaigns.', ['Marketing', 'Sales'], 'Entra', 'success'],
  ['Sofia Nguyen', 'Inactive', 'Coordinates marketing campaigns.', ['Marketing', 'Sales'], 'Entra', 'success'],
];

const userRows: ARSTableRow[] = USERS.map(([name, status, description, tags, location, tone], i) => ({
  id: `user-${i}`,
  name,
  status,
  statusTone: tone ?? TONE[status],
  description,
  tags,
  location,
}));

type MixedSample = [name: string, icon: string, objectType: string, tags: string[]];

/** Figma sample rows for the Mixed variant. */
const MIXED: MixedSample[] = [
  ['Test1', 'Folder', 'Organizational Unit', ['OU', 'Folder']],
  ['Test2', 'Folder', 'Organizational Unit', ['OU', 'Folder']],
  ['Ava Morgan', 'User', 'User', ['HR', 'Compliance']],
  ['Ethan Hayes', 'User', 'User', ['Security', 'Helpdesk']],
  ['Mia Foster', 'User', 'User', ['Platform', 'Administrator']],
  ['Lucas Grant', 'User', 'User', ['HR', 'Global']],
  ['Computer 1', 'Desktop', 'Computer', ['Windows11', 'Staff Assets']],
  ['Computer 2', 'Desktop', 'Computer', ['Windows 11', 'Staff Assets']],
  ['Access Group', 'UsersThree', 'Group', ['Software Access', 'Marketing']],
  ['Security Group', 'UsersThree', 'Group', ['Infrastructure Access', 'Security Access']],
  ['HR Files', 'FolderUser', 'Shared folder', ['HR', 'Operations']],
  ['Colab.Inc', 'AddressBookTabs', 'Contact', ['3rd Party', 'contacts']],
  ['Epson 1', 'Printer', 'Printer', ['Devices']],
  ['Security Access', 'UserCircle', 'Group Managed Service Account', ['Shared Access Account', 'Security']],
];

const mixedRows: ARSTableRow[] = MIXED.map(([name, icon, objectType, tags], i) => ({
  id: `object-${i}`,
  name,
  href: '#',
  icon,
  objectType,
  tags,
  location: 'Active Directory\\Test OU',
}));

const paging = { page: 1, pageCount: 154, pages: [1, 2, 3, 4, 'ellipsis', 154] as (number | 'ellipsis')[], pageSize: 15 };

/** Figma "Variant=Default" (82:29416). */
export const Default: Story = { args: { variant: 'Default', rows: userRows, ...paging } };

/** Figma "Variant=Mixed" (99:30761). */
export const Mixed: Story = { args: { variant: 'Mixed', rows: mixedRows, ...paging } };

/** Figma "Variant=Empty" (2068:32496). */
export const Empty: Story = { args: { variant: 'Empty' } };

/** Figma "Variant=filter" (4250:15771). */
export const Filter: Story = { name: 'filter', args: { variant: 'filter', rows: userRows, ...paging } };
