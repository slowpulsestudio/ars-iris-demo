import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResourceIcon } from '@iris/components/ResourceIcon/ResourceIcon.js';

const meta = {
  title: 'Iris/ResourceIcon',
  component: ResourceIcon,
  parameters: {
    docs: { description: { component: 'Bordered round tile that frames an icon, used as the avatar for non-people objects such as groups, folders or applications. Iris code: src/iris-shell/src/components/ResourceIcon.' } },
  },
  args: { icon: 'UsersThree', ariaLabel: 'Group' },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'l'] } },
} satisfies Meta<typeof ResourceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <ResourceIcon {...args} size="default" />
      <ResourceIcon {...args} size="l" />
    </div>
  ),
};

export const CustomIconSize: Story = { name: 'Custom icon size', args: { iconSize: '20px' } };
