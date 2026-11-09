import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideSheet, type SideSheetProps } from '@iris/components/SideSheet/SideSheet.js';
import { Button } from '@iris/components/Button/Button.js';
import { DescriptionList } from '@iris/components/DescriptionList/DescriptionList.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Textarea } from '@iris/components/Textarea/Textarea.js';

interface SideSheetDemoProps extends SideSheetProps {
  triggerLabel: string;
  withBack?: boolean;
  withFooter?: boolean;
}

function SideSheetDemo({ triggerLabel, withBack = false, withFooter = false, ...args }: SideSheetDemoProps) {
  const [open, setOpen] = useState(args.open);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <SideSheet
        {...args}
        open={open}
        onClose={close}
        onBack={withBack ? close : undefined}
        footer={
          withFooter ? (
            <>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button onClick={close}>Save</Button>
            </>
          ) : undefined
        }
      />
    </>
  );
}

const meta = {
  title: 'Iris/SideSheet',
  component: SideSheet,
  parameters: {
    docs: { description: { component: 'Panel that slides in from the right over a scrim and closes on Esc, a scrim click or the close button. Iris code: src/iris-shell/src/components/SideSheet.' } },
  },
  args: {
    open: true,
    onClose: () => {},
    title: 'Properties',
    subtitle: 'Sofia Nguyen',
    children: (
      <DescriptionList
        items={[
          { label: 'First name', value: 'Sofia' },
          { label: 'Last name', value: 'Nguyen' },
          { label: 'Display name', value: 'Sofia Nguyen' },
          { label: 'User principal name', value: 'SNguyen@O1D.local' },
          { label: 'Description', value: 'Oversees platform administration.' },
        ]}
      />
    ),
  },
  argTypes: { children: { control: false }, footer: { control: false } },
  render: (args) => <SideSheetDemo key={String(args.open)} {...args} triggerLabel="View properties" />,
} satisfies Meta<typeof SideSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBackButton: Story = {
  name: 'With back button',
  parameters: {
    docs: { description: { story: 'There is no earlier view to go back to here, so Back closes the sheet.' } },
  },
  render: (args) => (
    <SideSheetDemo key={String(args.open)} {...args} triggerLabel="View properties" withBack />
  ),
};

export const WithFooter: Story = {
  name: 'With footer',
  args: {
    title: 'Edit Sofia Nguyen’s property details',
    subtitle: undefined,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-l)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--oi-spacing-l)' }}>
          <FormField label="First name" required>
            <TextInput defaultValue="Sofia" autoComplete="given-name" />
          </FormField>
          <FormField label="Last name" required>
            <TextInput defaultValue="Nguyen" autoComplete="family-name" />
          </FormField>
          <FormField label="Initials" required>
            <TextInput defaultValue="SN" maxLength={4} />
          </FormField>
          <FormField label="Display name" required>
            <TextInput defaultValue="Sofia Nguyen" />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea rows={6} defaultValue="Oversees platform administration." />
        </FormField>
      </div>
    ),
  },
  render: (args) => (
    <SideSheetDemo key={String(args.open)} {...args} triggerLabel="Edit properties" withFooter />
  ),
};
