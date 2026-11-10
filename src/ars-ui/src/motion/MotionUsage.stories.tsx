import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiPanel } from '@iris/components/AiPanel/AiPanel.js';
import { Button } from '@iris/components/Button/Button.js';
import { SideSheet } from '@iris/components/SideSheet/SideSheet.js';
import { Stepper } from '@iris/components/Stepper/Stepper.js';
import { Tabs } from '@iris/components/Tabs/Tabs.js';
import { Toast } from '@iris/components/Toast/Toast.js';
import { useAppShell } from '@iris/lib/appShellContext.js';
import { MotionPattern } from './MotionDemo.js';
import { IrisAppProviders, withRoute } from '../stories/IrisAppProviders.js';
import styles from './Motion.module.css';

function SideSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <MotionPattern
      steps={[
        {
          label: 'Enter',
          what: 'Slides in from the right; the scrim fades in.',
          duration: '--oi-motion-duration-long',
          easing: '--oi-motion-ease-drawer',
        },
        {
          label: 'Exit',
          what: 'Slides out; the scrim fades out.',
          duration: '--oi-motion-duration-default',
          easing: '--oi-motion-ease-exit',
        },
        { label: 'Reduced motion', what: 'No slide; the scrim still fades.' },
      ]}
      actions={<Button onClick={() => setOpen(true)}>Open side sheet</Button>}
    >
      <SideSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Side sheet"
        footer={
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      >
        <p>Close with the button, Escape or a click on the scrim.</p>
      </SideSheet>
    </MotionPattern>
  );
}

function AskAiDemo() {
  const { aiOpen, setAiOpen } = useAppShell();
  return (
    <MotionPattern
      steps={[
        {
          label: 'Enter',
          what: 'Fades in and slides 8px from the right.',
          duration: '--oi-motion-duration-long',
          easing: '--oi-motion-ease-enter',
        },
        {
          label: 'Exit',
          what: 'Fades out and slides 8px to the right, then unmounts.',
          duration: '--oi-motion-duration-default',
          easing: '--oi-motion-ease-exit',
        },
        { label: 'Reduced motion', what: 'Appears and disappears without animation.' },
      ]}
      actions={
        <Button iconLead="Sparkle" onClick={() => setAiOpen((v) => !v)}>
          {aiOpen ? 'Close Ask AI' : 'Open Ask AI'}
        </Button>
      }
    >
      <div className={styles.stage}>
        <div className={styles.stagePage} />
        <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    </MotionPattern>
  );
}

function ToastDemo() {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <MotionPattern
      steps={[
        {
          label: 'Enter',
          what: 'Rises 16px, scales from 0.97, fades in and unblurs.',
          duration: '--oi-motion-duration-long',
          easing: '--oi-motion-ease-enter',
        },
        {
          label: 'Exit',
          what: 'The reverse, on the shorter clock.',
          duration: '--oi-motion-duration-short',
          easing: '--oi-motion-ease-exit',
        },
        { label: 'Reduced motion', what: 'Fades only; no movement.' },
      ]}
      actions={<Button onClick={() => setMessage('Changes saved')}>Show toast</Button>}
    >
      <Toast
        message={message}
        tone="success"
        supportingText="Closes after 5 seconds, or dismiss it."
        onDismiss={() => setMessage(null)}
      />
    </MotionPattern>
  );
}

const TABS = [
  { value: 'general', label: 'General' },
  { value: 'members', label: 'Members' },
  { value: 'member-of', label: 'Member of' },
  { value: 'managed-by', label: 'Managed by' },
];

function TabsDemo() {
  const [value, setValue] = useState(TABS[0].value);
  return (
    <MotionPattern
      steps={[
        {
          label: 'Underline',
          what: 'Slides and resizes to the selected tab.',
          duration: '--oi-motion-duration-default',
          easing: '--oi-motion-ease-emphasized',
        },
        { label: 'Reduced motion', what: 'Jumps to the selected tab.' },
      ]}
    >
      <Tabs items={TABS} value={value} onChange={setValue} ariaLabel="Tabs" />
    </MotionPattern>
  );
}

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'properties', label: 'Properties' },
  { id: 'review', label: 'Review' },
];

function StepperDemo() {
  const [active, setActive] = useState(0);
  return (
    <MotionPattern
      steps={[
        {
          label: 'Check',
          what: 'A completed step’s check fades in, grows from 0.3 and turns from −35°.',
          duration: '--oi-motion-duration-long',
          easing: '--oi-motion-ease-enter',
        },
        { label: 'Reduced motion', what: 'The check appears without animation.' },
      ]}
      actions={
        <>
          <Button variant="secondary" disabled={active === 0} onClick={() => setActive((i) => i - 1)}>
            Back
          </Button>
          <Button disabled={active === STEPS.length} onClick={() => setActive((i) => i + 1)}>
            Next
          </Button>
        </>
      }
    >
      <Stepper steps={STEPS} activeIndex={active} ariaLabel="Steps" />
    </MotionPattern>
  );
}

const meta = {
  title: 'Motion/Usage',
  parameters: {
    docs: {
      description: {
        component:
          'Motion in the Iris components the ARS screens use, with the tokens each one uses. The components are the Iris code itself, so these show exactly what ships.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideSheetMotion: Story = {
  name: 'Side sheet',
  render: () => <SideSheetDemo />,
};

export const AskAiPanelMotion: Story = {
  name: 'Ask AI panel',
  beforeEach: () => withRoute('#/users'),
  decorators: [
    (Story) => (
      <IrisAppProviders>
        <Story />
      </IrisAppProviders>
    ),
  ],
  render: () => <AskAiDemo />,
};

export const ToastMotion: Story = {
  name: 'Toast',
  render: () => <ToastDemo />,
};

export const TabsUnderlineMotion: Story = {
  name: 'Tabs underline',
  render: () => <TabsDemo />,
};

export const StepperCheckMotion: Story = {
  name: 'Stepper check',
  render: () => <StepperDemo />,
};
