import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, type CheckboxProps } from '@iris/components/Checkbox/Checkbox.js';

function CheckboxDemo(args: CheckboxProps) {
  const [checked, setChecked] = useState(args.checked);
  const [indeterminate, setIndeterminate] = useState(args.indeterminate);
  return (
    <Checkbox
      {...args}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(next) => {
        setChecked(next);
        setIndeterminate(false);
      }}
    />
  );
}

const meta = {
  title: 'Iris/Checkbox',
  component: Checkbox,
  parameters: {
    docs: { description: { component: 'Controlled checkbox with checked, unchecked and indeterminate states. Iris code: src/iris-shell/src/components/Checkbox.' } },
  },
  args: { ariaLabel: 'Select Sofia Nguyen', checked: false, indeterminate: false },
  render: (args) => <CheckboxDemo key={`${args.checked}-${args.indeterminate}`} {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const Indeterminate: Story = { args: { indeterminate: true, ariaLabel: 'Select all rows' } };

export const Disabled: Story = { args: { disabled: true } };

/** Iris UI Kit "Size=medium" (20px box, 16px label). */
export const Medium: Story = { args: { size: 'medium', checked: true, label: 'Checked, Normal' } };

/** Iris UI Kit checkbox with its label. */
export const WithLabel: Story = { name: 'With label', args: { checked: true, label: 'Checked, Normal' } };

/** Iris UI Kit "State=Disabled" for each value. */
export const DisabledValues: Story = {
  name: 'Disabled values',
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--oi-spacing-l)' }}>
      <Checkbox {...args} disabled label="Unchecked" />
      <Checkbox {...args} disabled checked label="Checked" />
      <Checkbox {...args} disabled indeterminate label="Mixed" />
    </div>
  ),
};
