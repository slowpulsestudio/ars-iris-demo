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
    docs: { description: { component: 'Bottom-right status notification with a success icon and a dismiss button. Iris code: src/iris-shell/src/components/Toast.' } },
  },
  args: { message: 'Password reset for Sofia Nguyen', onDismiss: () => {} },
  render: (args) => <ToastDemo key={args.message} {...args} />,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
