import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '@iris/components/TextInput/TextInput.js';

const meta = {
  title: 'Iris/TextInput',
  component: TextInput,
  parameters: {
    docs: { description: { component: 'Single-line text field. Iris code: src/iris-shell/src/components/TextInput.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { 'aria-label': 'Display name', placeholder: 'Markus Kim' },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'l'] } },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = { args: { defaultValue: 'Markus Kim' } };

/** Iris UI Kit sizes: Default (28px) and Large (32px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-s)' }}>
      <TextInput {...args} size="default" placeholder="Default" />
      <TextInput {...args} size="l" placeholder="Large" />
    </div>
  ),
};

/** Iris UI Kit "State=Readonly". */
export const ReadOnly: Story = { name: 'Read-only', args: { readOnly: true, defaultValue: 'Markus Kim' } };

/** Iris UI Kit "State=Disabled". */
export const Disabled: Story = { args: { disabled: true } };

export const WithLeadingIcon: Story = {
  name: 'With leading icon',
  args: { iconLead: 'MagnifyingGlass', 'aria-label': 'Search users', placeholder: 'Search users' },
};

export const WithTrailingIcon: Story = {
  name: 'With trailing icon',
  args: { iconTrail: 'EnvelopeSimple', type: 'email', 'aria-label': 'Email', placeholder: 'mkim@dom.net' },
};

export const Invalid: Story = {
  args: { invalid: true, type: 'email', 'aria-label': 'Email', defaultValue: 'mkim@' },
};
