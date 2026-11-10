import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, type SelectProps } from '@iris/components/Select/Select.js';
import { Menu } from '@iris/components/Menu/Menu.js';

const OBJECT_TYPES = ['All', 'User', 'Group', 'Computer', 'Contact'];

function SelectWithMenu(args: SelectProps) {
  const [objectType, setObjectType] = useState('All');

  return (
    <Menu
      align="start"
      ariaLabel="Object type"
      items={OBJECT_TYPES.map((type) => ({
        kind: 'item' as const,
        label: type,
        selected: type === objectType,
        onSelect: () => setObjectType(type),
      }))}
      trigger={({ ref, onClick, expanded }) => (
        <span ref={ref} style={{ display: 'flex' }}>
          <Select
            {...args}
            label={`Object type: ${objectType}`}
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          />
        </span>
      )}
    />
  );
}

const meta = {
  title: 'Iris/Select',
  component: Select,
  parameters: {
    docs: { description: { component: 'Display-only dropdown trigger that opens nothing by itself; wire a menu to it when needed. Iris code: src/iris-shell/src/components/Select.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Object type: All' },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'l'] } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Iris UI Kit "State=Default": nothing chosen yet. */
export const Placeholder: Story = { args: { label: '', placeholder: 'Choose an option...' } };

/** Iris UI Kit sizes: Default (28px) and Large (32px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-s)' }}>
      <Select {...args} size="default" label="Default" />
      <Select {...args} size="l" label="Large" />
    </div>
  ),
};

/** Iris UI Kit "State=Error". */
export const Invalid: Story = { args: { invalid: true } };

export const LongLabel: Story = {
  name: 'Long label',
  args: { label: 'Location: Active Directory\\dom.net\\EMEA\\Sales Division\\Customer Support' },
};

export const WithMenu: Story = {
  name: 'With menu',
  render: (args) => <SelectWithMenu {...args} />,
};
