import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@iris/components/Textarea/Textarea.js';

const meta = {
  title: 'Iris/Textarea',
  component: Textarea,
  parameters: {
    docs: { description: { component: 'Multi-line text field that matches the look of TextInput. Iris code: src/iris-shell/src/components/Textarea.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { 'aria-label': 'Description', placeholder: 'Describe what this group is for' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: 'Sales Division members in the EMEA region. Managed by Customer Support.' },
};

export const MoreRows: Story = { name: 'More rows', args: { rows: 8 } };

export const Invalid: Story = { args: { invalid: true } };

/** Iris UI Kit "State=Readonly". */
export const ReadOnly: Story = {
  name: 'Read-only',
  args: { readOnly: true, defaultValue: 'Sales Division members in the EMEA region.' },
};

/** Iris UI Kit "State=Disabled". */
export const Disabled: Story = { args: { disabled: true } };
