import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitButton } from '@iris/components/SplitButton/SplitButton.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';

const CREATE_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'New group', icon: 'UsersThree' },
  { kind: 'item', label: 'New computer', icon: 'Devices' },
  { kind: 'item', label: 'New contact', icon: 'AddressBook' },
  { kind: 'item', label: 'New organizational unit', icon: 'FolderPlus' },
];

const meta = {
  title: 'Iris/SplitButton',
  component: SplitButton,
  parameters: {
    docs: { description: { component: 'Main action button paired with a chevron that opens a menu of related actions. Iris code: src/iris-shell/src/components/SplitButton.' } },
  },
  args: { children: 'New user', ariaMenuLabel: 'More create options' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'inline-radio', options: ['s', 'default', 'l'] },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Danger: Story = { args: { variant: 'danger', children: 'Delete', ariaMenuLabel: 'More delete options' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <SplitButton {...args} size="s">Small</SplitButton>
      <SplitButton {...args} size="default">Default</SplitButton>
      <SplitButton {...args} size="l">Large</SplitButton>
    </div>
  ),
};

export const WithIcon: Story = { name: 'With icon', args: { iconLead: 'Plus' } };

export const WithMenu: Story = {
  name: 'With menu',
  render: (args) => (
    <Menu
      align="start"
      ariaLabel="Create"
      items={CREATE_ITEMS}
      trigger={({ ref, onClick, expanded }) => (
        <span ref={ref} style={{ display: 'inline-flex' }}>
          <SplitButton {...args} expanded={expanded} onMenuClick={onClick} />
        </span>
      )}
    />
  ),
};
