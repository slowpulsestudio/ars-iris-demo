import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, type ModalProps } from '@iris/components/Modal/Modal.js';
import { Button, type ButtonProps } from '@iris/components/Button/Button.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Icon } from '@iris/components/Icon/Icon.js';

// Mirrors the warning badge the app's Delete user modal shows in its header.
const DANGER_BADGE = (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'var(--oi-size-l)',
      height: 'var(--oi-size-l)',
      borderRadius: 'var(--oi-border-radius-max)',
      backgroundColor: 'var(--oi-background-color-error)',
      border: 'var(--oi-border-width-default) var(--oi-border-style-solid) var(--oi-border-color-badge-error)',
      color: 'var(--oi-content-color-error)',
    }}
  >
    <Icon name="Warning" size="var(--oi-size-s)" />
  </span>
);

interface ModalDemoProps extends ModalProps {
  /** Label of the button that opens the modal and of its confirm button. */
  actionLabel: string;
  actionVariant?: ButtonProps['variant'];
}

function ModalDemo({ actionLabel, actionVariant = 'primary', ...args }: ModalDemoProps) {
  const [open, setOpen] = useState(args.open);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant={actionVariant} onClick={() => setOpen(true)}>
        {actionLabel}
      </Button>
      <Modal
        {...args}
        open={open}
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant={actionVariant} onClick={close}>
              {actionLabel}
            </Button>
          </>
        }
      />
    </>
  );
}

const meta = {
  title: 'Iris/Modal',
  component: Modal,
  parameters: {
    docs: { description: { component: 'Centered dialog over a scrim that closes on Esc, a scrim click or the close button. Iris code: src/iris-shell/src/components/Modal.' } },
  },
  args: {
    open: true,
    onClose: () => {},
    title: 'Reset password',
    subtitle: 'Sofia Nguyen',
    children: (
      <FormField label="New password">
        <TextInput type="password" autoComplete="new-password" />
      </FormField>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    iconPlacement: { control: 'inline-radio', options: ['inline', 'top'] },
    leadingIcon: { control: false },
    children: { control: false },
    footer: { control: false },
  },
  render: (args) => <ModalDemo key={String(args.open)} {...args} actionLabel="Reset password" />,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Danger: Story = {
  args: {
    title: 'Delete user',
    subtitle: undefined,
    size: 's',
    leadingIcon: DANGER_BADGE,
    iconPlacement: 'top',
    children: (
      <p style={{ margin: 0 }}>
        Are you sure you want to delete the user Sofia Nguyen? This action cannot be undone.
      </p>
    ),
  },
  render: (args) => (
    <ModalDemo key={String(args.open)} {...args} actionLabel="Delete user" actionVariant="danger" />
  ),
};

export const Small: Story = { args: { size: 's' } };

export const Medium: Story = { args: { size: 'm' } };

export const Large: Story = { args: { size: 'l' } };

export const IconInline: Story = {
  name: 'Icon inline',
  args: { leadingIcon: 'Password', iconPlacement: 'inline' },
};

export const IconTop: Story = {
  name: 'Icon top',
  args: { leadingIcon: 'Password', iconPlacement: 'top' },
};
