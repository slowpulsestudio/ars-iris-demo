import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@iris/components/Icon/Icon.js';

const NAMES = ['User', 'UsersThree', 'Folder', 'Devices', 'AddressBook', 'MagnifyingGlass', 'Gear', 'Trash'];

const meta = {
  title: 'Iris/Icon',
  component: Icon,
  parameters: {
    docs: { description: { component: 'Named SVG icon from the Iris icon library that takes its colour from the surrounding text. Iris code: src/iris-shell/src/components/Icon.' } },
  },
  args: { name: 'UsersThree', title: 'Group' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Names: Story = {
  args: { title: undefined },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--oi-spacing-xl)' }}>
      {NAMES.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--oi-spacing-xs)' }}>
          <Icon {...args} name={name} />
          {name}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <Icon {...args} size="16px" />
      <Icon {...args} size="20px" />
      <Icon {...args} size="24px" />
    </div>
  ),
};
