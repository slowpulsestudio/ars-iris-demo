import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@iris/components/Avatar/Avatar.js';

const meta = {
  title: 'Iris/Avatar',
  component: Avatar,
  parameters: {
    docs: { description: { component: 'Circular user avatar that shows a photo, or initials when there is no photo. Iris code: src/iris-shell/src/components/Avatar.' } },
  },
  args: { name: 'David Smith', src: '/avatars/david-smith.png' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'default', 'l'] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Initials: Story = { args: { name: 'Sofia Nguyen', src: undefined } };

/** Iris UI Kit sizes: Small 16, Medium 24, Default 32, Large 48. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <Avatar {...args} size="s" />
      <Avatar {...args} size="m" />
      <Avatar {...args} size="default" />
      <Avatar {...args} size="l" />
    </div>
  ),
};
