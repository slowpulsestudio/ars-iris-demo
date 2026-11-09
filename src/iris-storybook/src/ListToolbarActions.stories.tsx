import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ListToolbarActions,
  type ListToolbarActionsProps,
} from '@iris/components/ListToolbarActions/ListToolbarActions.js';
import { ContentHeader } from '@iris/components/ContentHeader/ContentHeader.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import type { MenuEntry } from '@iris/components/Menu/Menu.js';

// Filter menu from the Users page toolbar.
const FILTER_MENU_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'Advanced filter', icon: 'FunnelSimple' },
  { kind: 'divider' },
  { kind: 'item', label: 'Display name' },
  { kind: 'item', label: 'Object type' },
  { kind: 'item', label: 'Location' },
  {
    kind: 'submenu',
    label: 'Dates',
    items: [
      { kind: 'item', label: 'Date active' },
      { kind: 'item', label: 'Date created' },
    ],
  },
];

// Create menu from the Users page toolbar.
const CREATE_MENU_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'User', icon: 'User' },
  { kind: 'item', label: 'Group', icon: 'UsersThree' },
  { kind: 'divider' },
  { kind: 'item', label: 'Computer', icon: 'Devices' },
  { kind: 'divider' },
  { kind: 'item', label: 'Organizational Unit', icon: 'FolderPlus' },
  { kind: 'item', label: 'Shared Folder', icon: 'Folders' },
  { kind: 'divider' },
  { kind: 'item', label: 'Contact', icon: 'AddressBook' },
  { kind: 'item', label: 'Group Management Service Account', icon: 'UserCircle' },
];

function ListToolbarActionsDemo(args: ListToolbarActionsProps) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(args.filterMenuOpen);
  return (
    <ListToolbarActions {...args} filterMenuOpen={filterMenuOpen} onFilterOpenChange={setFilterMenuOpen} />
  );
}

const meta = {
  title: 'Iris/ListToolbarActions',
  component: ListToolbarActions,
  parameters: {
    docs: { description: { component: 'Filter and Create menu pair rendered in the page header toolbar of the directory list pages (Users, Tree). Iris code: src/iris-shell/src/components/ListToolbarActions.' } },
  },
  // As on the Users page: in the header toolbar, to the right of the search field.
  decorators: [
    (Story) => (
      <ContentHeader
        icon="Users"
        title="Users"
        search={
          <TextInput
            iconLead="MagnifyingGlass"
            placeholder="Search by name, email, object ID etc."
            aria-label="Search users"
          />
        }
        toolbarActions={<Story />}
      />
    ),
  ],
  args: {
    filterMenuItems: FILTER_MENU_ITEMS,
    filterMenuOpen: false,
    onFilterOpenChange: () => {},
    createMenuItems: CREATE_MENU_ITEMS,
  },
  argTypes: {
    filterMenuItems: { control: false },
    createMenuItems: { control: false },
  },
  render: (args) => <ListToolbarActionsDemo key={String(args.filterMenuOpen)} {...args} />,
} satisfies Meta<typeof ListToolbarActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilterActive: Story = {
  name: 'Filter active',
  parameters: {
    docs: { description: { story: 'The dot on the Filter button shows that filters are applied.' } },
  },
  args: { filterActive: true },
};

export const FilterMenuOpen: Story = { name: 'Filter menu open', args: { filterMenuOpen: true } };
