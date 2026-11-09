import { useState, type MouseEvent, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, type MenuEntry, type MenuProps, type MenuTriggerArgs } from '@iris/components/Menu/Menu.js';
import { Button } from '@iris/components/Button/Button.js';
import { Avatar } from '@iris/components/Avatar/Avatar.js';

const OBJECT_ACTIONS: MenuEntry[] = [
  { kind: 'item', label: 'Reset password', icon: 'Key' },
  { kind: 'item', label: 'Properties', icon: 'Gear' },
  { kind: 'divider' },
  { kind: 'item', label: 'Deprovision', icon: 'Prohibit', danger: true },
  { kind: 'item', label: 'Delete', icon: 'Trash', danger: true },
];

const SECTIONED_ACTIONS: MenuEntry[] = [
  { kind: 'section', label: 'Manage' },
  { kind: 'item', label: 'Reset password', icon: 'Key' },
  { kind: 'item', label: 'Copy', icon: 'Copy' },
  { kind: 'item', label: 'Move', icon: 'Folder' },
  { kind: 'item', label: 'Properties', icon: 'Gear' },
  { kind: 'section', label: 'Related objects' },
  { kind: 'item', label: 'Connections', icon: 'Plugs' },
  { kind: 'item', label: 'Managed Units', icon: 'Cube' },
  { kind: 'item', label: 'Memberships', icon: 'UsersThree' },
  { kind: 'item', label: 'Roles', icon: 'IdentificationBadge' },
];

// Same options as the per-page menu in Iris Pagination.
const PAGE_SIZES = [10, 20, 30, 40, 50];

const MOVE_ACTIONS: MenuEntry[] = [
  { kind: 'item', label: 'Reset password', icon: 'Key' },
  { kind: 'item', label: 'Properties', icon: 'Gear' },
  {
    kind: 'submenu',
    label: 'Move to',
    icon: 'Folder',
    items: [
      { kind: 'item', label: 'DG-Tests', icon: 'Folder' },
      { kind: 'item', label: 'Managed Service Accounts', icon: 'Folder' },
      { kind: 'item', label: 'Program Data', icon: 'Folder' },
      { kind: 'item', label: 'Test OU', icon: 'Folder' },
    ],
  },
  { kind: 'divider' },
  { kind: 'item', label: 'Delete', icon: 'Trash', danger: true },
];

const UNAVAILABLE_ACTIONS: MenuEntry[] = [
  { kind: 'item', label: 'Reset password', icon: 'Key' },
  { kind: 'item', label: 'Unlock account', icon: 'LockOpen', disabled: true },
  { kind: 'item', label: 'Properties', icon: 'Gear' },
  { kind: 'item', label: 'Connections', icon: 'Plugs', inactive: true },
];

const USER_MENU: MenuEntry[] = [
  {
    kind: 'header',
    visual: <Avatar name="David Smith" src="/avatars/david-smith.png" size="l" />,
    primary: 'David Smith',
    secondary: 'david.smith@oneidentity.com',
  },
  { kind: 'divider' },
  { kind: 'item', label: 'Account settings', icon: 'Gear' },
  { kind: 'divider' },
  { kind: 'item', label: 'Sign out', icon: 'SignOut' },
];

function buttonTrigger(label: string) {
  return ({ ref, onClick, expanded }: MenuTriggerArgs) => (
    <Button
      ref={ref as Ref<HTMLButtonElement>}
      variant="secondary"
      iconTrail="CaretDown"
      aria-haspopup="menu"
      aria-expanded={expanded}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function MenuDemo(args: MenuProps) {
  const [open, setOpen] = useState(args.open);
  return <Menu {...args} open={open} onOpenChange={setOpen} />;
}

function PageSizeMenu(args: MenuProps) {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  return (
    <MenuDemo
      {...args}
      items={PAGE_SIZES.map<MenuEntry>((size) => ({
        kind: 'item',
        label: `${size} / page`,
        selected: size === pageSize,
        onSelect: () => setPageSize(size),
      }))}
      trigger={buttonTrigger(`${pageSize} / page`)}
    />
  );
}

function ContextMenuDemo(args: MenuProps) {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const openAtPointer = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Keyboard-opened context menus report 0,0, so anchor under the area instead.
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setPointer({ x: rect.left, y: rect.bottom });
      return;
    }
    setPointer({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        tabIndex={0}
        onContextMenu={openAtPointer}
        style={{
          padding: 'var(--oi-spacing-xxxl)',
          border: 'var(--oi-border-width-default) var(--oi-border-style-solid) var(--oi-border-color-default)',
          borderRadius: 'var(--oi-border-radius-l)',
          backgroundColor: 'var(--oi-background-color-primary)',
          color: 'var(--oi-content-color-secondary)',
        }}
      >
        Right-click anywhere in this area
      </div>
      <Menu
        {...args}
        trigger={undefined}
        open={pointer !== null}
        onOpenChange={(next) => {
          if (!next) setPointer(null);
        }}
        position={pointer ?? undefined}
      />
    </>
  );
}

const meta = {
  title: 'Iris/Menu',
  component: Menu,
  parameters: {
    docs: { description: { component: 'Accessible popover menu anchored to a trigger element. Iris code: src/iris-shell/src/components/Menu.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  args: { items: OBJECT_ACTIONS, ariaLabel: 'Object actions', align: 'start', trigger: buttonTrigger('Actions') },
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] } },
  render: (args) => <MenuDemo key={String(args.open)} {...args} />,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { open: true } };

export const WithSections: Story = { name: 'With sections', args: { items: SECTIONED_ACTIONS } };

export const SelectedItem: Story = {
  name: 'Selected item',
  args: { ariaLabel: 'Items per page' },
  render: (args) => <PageSizeMenu key={String(args.open)} {...args} />,
};

export const Submenu: Story = { args: { items: MOVE_ACTIONS } };

export const DisabledAndInactive: Story = {
  name: 'Disabled and inactive items',
  parameters: {
    docs: { description: { story: 'Unlock account is disabled. Connections is inactive (for example, coming soon). Neither can be selected.' } },
  },
  args: { items: UNAVAILABLE_ACTIONS },
};

export const HeaderBlock: Story = {
  name: 'Header block',
  args: { items: USER_MENU, ariaLabel: 'User menu', trigger: buttonTrigger('David Smith') },
};

export const ContextMenu: Story = {
  name: 'Context menu',
  render: (args) => <ContextMenuDemo {...args} />,
};
