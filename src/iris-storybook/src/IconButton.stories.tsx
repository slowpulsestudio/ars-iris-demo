import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { ProductIcon } from '@iris/components/ProductIcon/ProductIcon.js';

const meta = {
  title: 'Iris/IconButton',
  component: IconButton,
  parameters: {
    docs: { description: { component: 'Square button containing a single icon. Iris code: src/iris-shell/src/components/IconButton.' } },
  },
  args: { icon: 'DotsThree', ariaLabel: 'Object actions' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'secondary'] },
    size: { control: 'inline-radio', options: ['s', 'default', 'l'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: 'secondary', icon: 'ArrowsClockwise', ariaLabel: 'Refresh' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <IconButton {...args} size="s" />
      <IconButton {...args} size="default" />
      <IconButton {...args} size="l" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const CustomIcon: Story = {
  name: 'Custom icon',
  args: { icon: <ProductIcon name="active-roles" size={20} />, ariaLabel: 'Switch to Active Roles' },
};
