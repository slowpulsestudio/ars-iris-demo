import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField, type FormFieldProps } from '@iris/components/FormField/FormField.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Textarea } from '@iris/components/Textarea/Textarea.js';
import { Button } from '@iris/components/Button/Button.js';

function ValidationDemo(args: FormFieldProps) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const error = submitted && !value.trim() ? 'Display name is required.' : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-l)' }}>
      <FormField {...args} required error={error} shakeTrigger={shakeTrigger}>
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} placeholder="Markus Kim" />
      </FormField>
      <Button
        style={{ alignSelf: 'flex-start' }}
        onClick={() => {
          setSubmitted(true);
          setShakeTrigger((n) => n + 1);
        }}
      >
        Save
      </Button>
    </div>
  );
}

const meta = {
  title: 'Iris/FormField',
  component: FormField,
  parameters: {
    docs: { description: { component: 'Wraps a single form control with a label, required marker, optional info tooltip and error message. Iris code: src/iris-shell/src/components/FormField.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Display name', children: <TextInput placeholder="Markus Kim" /> },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const WithHelperText: Story = {
  name: 'With helper text',
  args: { helperText: 'Shown in the address book and in Active Roles lists.' },
};

/** Iris UI Kit feedback "Help". */
export const Help: Story = {
  args: { help: 'Enter your full name as it appears on your government issued ID or passport.' },
};

/** Iris UI Kit feedback "Warning". */
export const Warning: Story = {
  args: { warning: 'This name is already used by another object.' },
};

/** Iris UI Kit Label with "Count". */
export const WithCount: Story = {
  name: 'With count',
  args: { count: '0/100' },
};

export const WithError: Story = {
  name: 'Error',
  args: {
    label: 'Email',
    required: true,
    error: 'Enter a valid email address.',
    children: <TextInput type="email" defaultValue="mkim@" />,
  },
};

export const Validation: Story = {
  parameters: {
    docs: { description: { story: 'Click Save while the field is empty to show the error and replay the shake.' } },
  },
  render: (args) => <ValidationDemo {...args} />,
};

export const WithTextarea: Story = {
  name: 'With textarea',
  args: { label: 'Description', children: <Textarea placeholder="Describe what this group is for" /> },
};
