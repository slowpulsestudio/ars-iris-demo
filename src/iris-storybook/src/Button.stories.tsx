import { Fragment } from 'react';
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
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['s', 'default', 'l'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };

export const Secondary: Story = { args: { variant: 'secondary' } };

/** Iris UI Kit "Style=Ghost". */
export const Ghost: Story = { args: { variant: 'ghost' } };

/** Iris UI Kit "Style=Ghost": text only, icon + text and icon only, in each size. */
export const GhostTypes: Story = {
  name: 'Ghost types',
  args: { variant: 'ghost' },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        alignItems: 'center',
        gap: 'var(--oi-spacing-m)',
      }}
    >
      {(['s', 'default', 'l'] as const).map((size) => (
        <Fragment key={size}>
          <Button {...args} size={size}>
            Button
          </Button>
          <Button {...args} size={size} iconLead="Plus">
            Button
          </Button>
          <Button {...args} size={size} iconOnly iconLead="Plus" aria-label="Add" />
        </Fragment>
      ))}
    </div>
  ),
};

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
