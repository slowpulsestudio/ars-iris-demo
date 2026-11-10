import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '@iris/components/Banner/Banner.js';
import { Button } from '@iris/components/Button/Button.js';

const meta = {
  title: 'Iris/Banner',
  component: Banner,
  parameters: {
    docs: {
      description: {
        component: 'Persistent in-page message (Iris UI Kit "Banner"). Iris code: src/iris-shell/src/components/Banner.',
      },
    },
  },
  args: {
    title: 'Moonbase Alpha-4',
    children: 'You are currently logged in from Moonbase Alpha-4, located on Luna.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'warning', 'error', 'success'] },
    children: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 700 }}><Story /></div>],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Type=Info, Colored=False". */
export const Info: Story = {};

/** UI Kit "Colored=True". */
export const Colored: Story = { args: { colored: true, title: 'Arrival of crew', children: 'Crew-2 astronauts arrive at the space station.' } };

/** UI Kit "Type=Warning". */
export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Safety checks incomplete',
    children: 'Safety checks must be completed before this mission can be approved for launch.',
  },
};

/** UI Kit "Type=Error" with actions and dismiss. */
export const ErrorBanner: Story = {
  name: 'Error',
  args: {
    tone: 'error',
    title: 'Safety checks have failed',
    children: 'An issue has been discovered with your fuel mixture ratios. Please reconfigure your fuel mixture and perform safety checks again.',
    actions: (
      <>
        <Button size="s">Reconfigure</Button>
        <Button variant="secondary" size="s">
          Learn more
        </Button>
      </>
    ),
    onDismiss: () => {},
  },
};

/** UI Kit "Type=Success". */
export const Success: Story = {
  args: {
    tone: 'success',
    colored: true,
    title: 'Ready for lift-off',
    children: 'Safety checks are complete, and this mission has been approved for launch.',
  },
};
