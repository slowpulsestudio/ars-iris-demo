import { useState, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContentHeader, type ContentHeaderProps } from '@iris/components/ContentHeader/ContentHeader.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { ListToolbarActions } from '@iris/components/ListToolbarActions/ListToolbarActions.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { Tabs, type TabItem } from '@iris/components/Tabs/Tabs.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Tooltip } from '@iris/components/Tooltip/Tooltip.js';
import {
  FilterBar,
  newCondition,
  newGroup,
  useFilterModel,
  type FilterOption,
  type Group,
  type ParamCategory,
  type ParameterDef,
} from '@iris/components/Filters/index.js';

const PAGE_ACTIONS_MENU_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'Export CSV', icon: 'Export' },
  { kind: 'divider' },
  { kind: 'item', label: 'Customize', icon: 'Pencil' },
  { kind: 'item', label: 'Add page to favorites', icon: 'Star' },
];

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

const OBJECT_TYPE_OPTIONS: FilterOption[] = [
  { value: 'ou', label: 'Organizational Unit', icon: 'FolderPlus' },
  { value: 'user', label: 'User', icon: 'User' },
  { value: 'computer', label: 'Computer', icon: 'Devices' },
  { value: 'group', label: 'Group', icon: 'UsersThree' },
  { value: 'sharedFolder', label: 'Shared folder', icon: 'Folders' },
  { value: 'contact', label: 'Contact', icon: 'AddressBook' },
  { value: 'gmsa', label: 'Group Management Service Account', icon: 'UserCircle' },
];

const PARAMETERS: ParameterDef[] = [
  { id: 'displayName', label: 'Display name', icon: 'TextAa' },
  { id: 'objectType', label: 'Object type', icon: 'Cube', options: OBJECT_TYPE_OPTIONS },
  { id: 'tags', label: 'Tags', icon: 'Tag' },
  { id: 'location', label: 'Location', icon: 'MapPin' },
  { id: 'dateActive', label: 'Date active', icon: 'CalendarCheck', date: true },
  { id: 'dateCreated', label: 'Date created', icon: 'CalendarDots', date: true },
];

const PARAM_CATEGORIES: ParamCategory[] = [
  { label: 'Common', parameterIds: ['displayName', 'objectType', 'tags', 'location'] },
  { label: 'User', parameterIds: ['dateActive', 'dateCreated'] },
];

const ACTIVE_FILTER: Group = newGroup('and', [
  newCondition({ parameterId: 'objectType', operatorId: 'in', values: ['user', 'group'] }),
]);

const USER_TABS: TabItem[] = [
  { value: 'overview', label: 'Overview', icon: 'Briefcase' },
  { value: 'profile', label: 'Profile', icon: 'IdentificationCard' },
  { value: 'certificates', label: 'Certificates', icon: 'Certificate' },
  { value: 'history', label: 'History', icon: 'ClockCounterClockwise' },
];

const USER_ACTIONS: MenuEntry[] = [
  { kind: 'item', label: 'Reset password', icon: 'Password' },
  { kind: 'item', label: 'Delete', icon: 'Trash', danger: true },
];

const PAGE_ACTIONS = (
  <Menu
    ariaLabel="Page actions"
    align="end"
    items={PAGE_ACTIONS_MENU_ITEMS}
    trigger={({ ref, onClick, expanded }) => (
      <Tooltip label="More options">
        <IconButton
          ref={ref as Ref<HTMLButtonElement>}
          icon="DotsThree"
          ariaLabel="Page actions"
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={onClick}
        />
      </Tooltip>
    )}
  />
);

const SEARCH = (
  <TextInput iconLead="MagnifyingGlass" placeholder="Search by name, email, object ID etc." aria-label="Search users" />
);

const PAGER_AND_ACTIONS = (
  <>
    <Tooltip label="Previous user" shortcut={['K']}>
      <IconButton icon="CaretDown" ariaLabel="Previous user" />
    </Tooltip>
    <Tooltip label="Next user" shortcut={['J']}>
      <IconButton icon="CaretUp" ariaLabel="Next user" />
    </Tooltip>
    <Menu
      ariaLabel="User actions"
      align="end"
      items={USER_ACTIONS}
      trigger={({ ref, onClick, expanded }) => (
        <IconButton
          ref={ref as Ref<HTMLButtonElement>}
          icon="DotsThree"
          ariaLabel="User actions"
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={onClick}
        />
      )}
    />
  </>
);

const DETAIL_ARGS: Partial<ContentHeaderProps> = {
  variant: 'detail',
  icon: 'IdentificationCard',
  iconLabel: 'Isabella Clark avatar',
  title: 'Isabella Clark',
};

function UserTabs() {
  const [tab, setTab] = useState('overview');
  return <Tabs items={USER_TABS} value={tab} onChange={setTab} ariaLabel="User detail sections" />;
}

function ListToolbarDemo({ initialFilter, ...args }: ContentHeaderProps & { initialFilter?: Group }) {
  const { root, actions } = useFilterModel(initialFilter);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const addFilter = (parameterId: string) => actions.addCondition(root.id, { parameterId });
  const rootGroupCount = root.children.filter((c) => c.kind === 'group').length;
  const filterMenuItems: MenuEntry[] = [
    {
      kind: 'item',
      label: 'Advanced filter',
      icon: 'FunnelSimple',
      onSelect: () => actions.addGroup(root.id),
      disabled: rootGroupCount >= 6,
    },
    { kind: 'divider' },
    { kind: 'item', label: 'Display name', onSelect: () => addFilter('displayName') },
    { kind: 'item', label: 'Object type', onSelect: () => addFilter('objectType') },
    { kind: 'item', label: 'Location', onSelect: () => addFilter('location') },
    {
      kind: 'submenu',
      label: 'Dates',
      items: [
        { kind: 'item', label: 'Date active', onSelect: () => addFilter('dateActive') },
        { kind: 'item', label: 'Date created', onSelect: () => addFilter('dateCreated') },
      ],
    },
  ];
  const hasFilters = root.children.length > 0;

  return (
    <ContentHeader
      {...args}
      toolbarActions={
        <ListToolbarActions
          filterMenuItems={filterMenuItems}
          filterMenuOpen={filterMenuOpen}
          onFilterOpenChange={setFilterMenuOpen}
          createMenuItems={CREATE_MENU_ITEMS}
          filterActive={hasFilters}
        />
      }
      filters={
        hasFilters ? (
          <FilterBar
            root={root}
            parameters={PARAMETERS}
            categories={PARAM_CATEGORIES}
            actions={actions}
            addMenuItems={filterMenuItems}
          />
        ) : undefined
      }
    />
  );
}

const meta = {
  title: 'Iris/ContentHeader',
  component: ContentHeader,
  parameters: {
    docs: { description: { component: 'The shared page or detail header used across directory views. Iris code: src/iris-shell/src/components/ContentHeader.' } },
  },
  // The app's content surface: the grey filter band blends into the grey canvas without it.
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'var(--oi-background-color-primary)' }}>
        <Story />
      </div>
    ),
  ],
  args: { icon: 'Heart', title: 'Favourites' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['list', 'detail'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    actions: { control: false },
    search: { control: false },
    toolbarActions: { control: false },
    filters: { control: false },
    tabs: { control: false },
  },
} satisfies Meta<typeof ContentHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  name: 'With actions',
  args: { icon: 'Users', title: 'Users', actions: PAGE_ACTIONS },
};

export const WithSearch: Story = {
  name: 'With search',
  args: { icon: 'Users', title: 'Users', search: SEARCH },
};

export const WithToolbarActions: Story = {
  name: 'With toolbar actions',
  parameters: {
    docs: { description: { story: 'Filter and Create menus beside the search field, as on the Users page. Pick a filter to add it to the filter bar.' } },
  },
  args: { icon: 'Users', title: 'Users', search: SEARCH },
  render: (args) => <ListToolbarDemo {...args} />,
};

export const WithFilters: Story = {
  name: 'With filters',
  parameters: {
    docs: { description: { story: 'Active filters show in a band beneath the toolbar. Remove the filter, or add more from the Filter menu or the + button.' } },
  },
  args: { icon: 'Users', title: 'Users', search: SEARCH },
  render: (args) => <ListToolbarDemo {...args} initialFilter={ACTIVE_FILTER} />,
};

export const Detail: Story = { args: DETAIL_ARGS };

export const DetailWithSubtitle: Story = {
  name: 'Detail with subtitle',
  args: { ...DETAIL_ARGS, subtitle: 'Isabella.Clark' },
};

export const DetailWithBackButton: Story = {
  name: 'Detail with back button',
  args: { ...DETAIL_ARGS, onBack: () => {}, backLabel: 'Back to Users' },
};

export const DetailWithActions: Story = {
  name: 'Detail with actions',
  args: { ...DETAIL_ARGS, actions: PAGER_AND_ACTIONS },
};

export const DetailWithTabs: Story = {
  name: 'Detail with tabs',
  args: { ...DETAIL_ARGS, tabs: <UserTabs /> },
};
