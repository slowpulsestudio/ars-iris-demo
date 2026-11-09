import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@iris/components/Button/Button.js';

const meta = {
  title: 'Iris/Button',
  component: Button,
  parameters: {
    docs: { description: { component: 'Primary action element. Iris code: src/iris-shell/src/components/Button.' } },
  },
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'inline-radio', options: ['s', 'default', 'l'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <Button {...args} size="s">Small</Button>
      <Button {...args} size="default">Default</Button>
      <Button {...args} size="l">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  args: { variant: 'secondary', iconLead: 'Plus', iconTrail: 'CaretDown', children: 'Create' },
};

export const IconOnly: Story = {
  name: 'Icon only',
  args: { variant: 'secondary', iconOnly: true, iconLead: 'Gear', children: undefined, 'aria-label': 'Settings' },
};

export const Disabled: Story = { args: { disabled: true } };
