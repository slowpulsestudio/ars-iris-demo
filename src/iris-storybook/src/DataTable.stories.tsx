import { useState, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  type DataTableRow,
  type RowKey,
} from '@iris/components/DataTable/DataTable.js';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';

type UserStatus = 'Active' | 'Inactive' | 'Unknown';

interface UserRow {
  id: string;
  name: string;
  status: UserStatus;
  description: string;
  email: string;
  location: string;
}

const TEST_OU = 'Active Directory\\Test OU';

const USERS: UserRow[] = [
  { id: 'isabella-clark', name: 'Isabella Clark', status: 'Active', description: 'Oversees enterprise-wide platform security strategy and operations.', email: 'i.clark@acme.io', location: TEST_OU },
  { id: 'liam-bennett', name: 'Liam Bennett', status: 'Active', description: 'Manages global platform security policy and incident response.', email: 'l.bennett@acme.io', location: TEST_OU },
  { id: 'sophia-martinez', name: 'Sophia Martinez', status: 'Active', description: 'Coordinates platform security across business units.', email: 's.martinez@acme.io', location: TEST_OU },
  { id: 'noah-kim', name: 'Noah Kim', status: 'Active', description: 'Directs security operations and engineering teams.', email: 'n.kim@acme.io', location: TEST_OU },
  { id: 'mason-patel', name: 'Mason Patel', status: 'Active', description: 'Leads platform security architecture and design.', email: 'm.patel@acme.io', location: TEST_OU },
  { id: 'olivia-nguyen', name: 'Olivia Nguyen', status: 'Active', description: 'Responsible for platform security compliance reporting.', email: 'o.nguyen@acme.io', location: TEST_OU },
  { id: 'ethan-brooks', name: 'Ethan Brooks', status: 'Inactive', description: 'Drives platform security enhancements and reviews.', email: 'e.brooks@acme.io', location: TEST_OU },
  { id: 'ava-thompson', name: 'Ava Thompson', status: 'Active', description: 'Leads cross-functional teams on identity initiatives.', email: 'a.thompson@acme.io', location: TEST_OU },
  { id: 'lucas-rivera', name: 'Lucas Rivera', status: 'Unknown', description: 'Develops and enforces platform-wide security policy.', email: 'l.rivera@acme.io', location: TEST_OU },
  { id: 'mia-foster', name: 'Mia Foster', status: 'Active', description: 'Oversees platform security operations and metrics.', email: 'm.foster@acme.io', location: TEST_OU },
];

const STATUS_BADGE: Record<UserStatus, { tone: BadgeTone; icon: string }> = {
  Active: { tone: 'success', icon: 'CheckCircle' },
  Inactive: { tone: 'error', icon: 'XCircle' },
  Unknown: { tone: 'warning', icon: 'WarningCircle' },
};

const COLUMNS: DataTableColumn<UserRow>[] = [
  {
    key: 'name',
    header: 'Name',
    icon: 'IdentificationCard',
    width: '180px',
    cell: (u) => <Link href="#">{u.name}</Link>,
  },
  {
    key: 'status',
    header: 'Status',
    icon: 'UserCircleCheck',
    width: '128px',
    cell: (u) => <Badge {...STATUS_BADGE[u.status]}>{u.status}</Badge>,
  },
  {
    key: 'description',
    header: 'Description',
    icon: 'ArticleNyTimes',
    minWidth: '224px',
    maxWidth: '480px',
    grow: 2,
    cell: (u) => <span title={u.description}>{u.description}</span>,
  },
  {
    key: 'email',
    header: 'Email',
    icon: 'Envelope',
    width: '200px',
    cell: (u) => <span title={u.email}>{u.email}</span>,
  },
  {
    key: 'location',
    header: 'Location',
    icon: 'MapPin',
    minWidth: '200px',
    grow: 1,
    cell: (u) => <span title={u.location}>{u.location}</span>,
  },
];

const ROW_MENU_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'Reset Password', icon: 'Password' },
  { kind: 'item', label: 'Copy', icon: 'Copy' },
  { kind: 'item', label: 'Move', icon: 'Folder' },
  { kind: 'item', label: 'Properties', icon: 'UserList' },
  { kind: 'divider' },
  { kind: 'item', label: 'Connections', icon: 'Plugs' },
  { kind: 'item', label: 'Managed Units', icon: 'Cube' },
  { kind: 'item', label: 'Memberships', icon: 'UsersThree' },
  { kind: 'item', label: 'Roles', icon: 'IdentificationBadge' },
  { kind: 'divider' },
  { kind: 'item', label: 'Deprovision', icon: 'Prohibit', danger: true },
  { kind: 'item', label: 'Deactivate', icon: 'XCircle', danger: true },
  { kind: 'item', label: 'Delete', icon: 'Trash', danger: true },
];

function DataTableDemo(args: DataTableProps<DataTableRow>) {
  const [selected, setSelected] = useState(args.selected);
  return <DataTable {...args} selected={selected} onSelectionChange={setSelected} />;
}

const meta = {
  title: 'Iris/DataTable',
  component: DataTable,
  parameters: {
    docs: { description: { component: 'Selectable data grid that stretches to fill its container and scrolls sideways when its columns no longer fit. Iris code: src/iris-shell/src/components/DataTable.' } },
  },
  args: { rows: USERS, columns: COLUMNS, ariaLabel: 'Users', rowLabel: (u: UserRow) => u.name },
  argTypes: {
    rows: { control: false },
    columns: { control: false },
    selected: { control: false },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  name: 'With selection',
  args: { selected: new Set<RowKey>(['liam-bennett', 'noah-kim']) },
  render: (args) => <DataTableDemo {...args} />,
};

export const RowActions: Story = {
  name: 'Row actions',
  parameters: {
    docs: { description: { story: 'The actions button on each row opens a menu of user actions, as on the Users page.' } },
  },
  args: {
    rowActions: (u: UserRow) => (
      <Menu
        ariaLabel={`Actions for ${u.name}`}
        align="end"
        items={ROW_MENU_ITEMS}
        trigger={({ ref, onClick, expanded }) => (
          <IconButton
            ref={ref as Ref<HTMLButtonElement>}
            icon="DotsThree"
            ariaLabel={`Actions for ${u.name}`}
            size="s"
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          />
        )}
      />
    ),
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    emptyState: { title: 'No users yet', description: 'Add your first user to get started.' },
  },
};

export const ClickableRows: Story = {
  name: 'Clickable rows, no actions',
  parameters: {
    docs: {
      description: {
        story:
          'hideRowActions leaves out the trailing action column, and onRowClick makes each row open on click, Enter or Space. Used by the self-service Approvals and My Access tables, which draw no action column.',
      },
    },
  },
  args: { hideRowActions: true, onRowClick: () => {} },
};

export const EmptyWithAction: Story = {
  name: 'Empty with action',
  args: {
    rows: [],
    emptyState: {
      title: 'No matching users',
      description: 'No users match “jordan”.',
      actionLabel: 'Clear search',
      onAction: () => {},
    },
  },
};
