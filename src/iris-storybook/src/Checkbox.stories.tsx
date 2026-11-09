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
