import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, type ToastProps } from '@iris/components/Toast/Toast.js';
import { Button } from '@iris/components/Button/Button.js';

function ToastDemo(args: ToastProps) {
  const [message, setMessage] = useState(args.message);
  return (
    <>
      <Button onClick={() => setMessage(args.message)}>Show toast</Button>
      <Toast {...args} message={message} onDismiss={() => setMessage(null)} />
    </>
  );
}

const meta = {
  title: 'Iris/Toast',
  component: Toast,
  parameters: {
    docs: { description: { component: 'Bottom-right notification (Iris UI Kit "Toast"): featured icon per type, title, optional supporting text and action, dismiss button. Auto-dismisses after 5 seconds; the countdown pauses on hover or focus. Iris code: src/iris-shell/src/components/Toast.' } },
  },
  args: { message: 'Password reset for Sofia Nguyen', onDismiss: () => {} },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'warning', 'error', 'success'] } },
  render: (args) => <ToastDemo key={`${args.message}-${args.tone}`} {...args} />,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Iris UI Kit "Type=Info". */
export const Info: Story = { args: { tone: 'info', message: 'Sync in progress' } };

/** Iris UI Kit "Type=Warning". */
export const Warning: Story = { args: { tone: 'warning', message: 'Licence expires soon' } };

/** Iris UI Kit "Type=Error". */
export const ErrorToast: Story = { name: 'Error', args: { tone: 'error', message: 'Upload failed' } };

/** Iris UI Kit toast with supporting text and actions. */
export const WithSupportingTextAndAction: Story = {
  name: 'With supporting text and action',
  args: {
    message: 'Ready for lift-off',
    supportingText: 'Safety checks are complete, and this mission has been approved for launch.',
    actions: (
      <Button variant="secondary" size="s">
        Undo
      </Button>
    ),
  },
};
