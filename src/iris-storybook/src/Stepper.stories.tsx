import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, type StepperProps, type StepperStepItem } from '@iris/components/Stepper/Stepper.js';

const STEPS: StepperStepItem[] = [
  { id: 'details', label: 'Details' },
  { id: 'account', label: 'Account' },
  { id: 'review', label: 'Review' },
];

const ERROR_STEPS: StepperStepItem[] = [
  { id: 'details', label: 'Details' },
  { id: 'account', label: 'Account', status: 'error' },
  { id: 'review', label: 'Review' },
];

function InteractiveStepper(args: StepperProps) {
  const [active, setActive] = useState(args.activeIndex ?? 0);
  const steps = args.steps.map((step, i) => ({ ...step, disabled: i > active + 1 }));
  return <Stepper {...args} steps={steps} activeIndex={active} interactive onStepSelect={setActive} />;
}

const meta = {
  title: 'Iris/Stepper',
  component: Stepper,
  parameters: {
    docs: { description: { component: 'Linear, ordered progress indicator that shows which steps of a flow are done, current or still to come. Iris code: src/iris-shell/src/components/Stepper.' } },
  },
  args: { steps: STEPS, activeIndex: 0, ariaLabel: 'New user steps' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InProgress: Story = { name: 'In progress', args: { activeIndex: 1 } };

export const AllCompleted: Story = { name: 'All completed', args: { activeIndex: STEPS.length } };

export const WithError: Story = { name: 'Error', args: { steps: ERROR_STEPS, activeIndex: 1 } };

export const ErrorOnEarlierStep: Story = {
  name: 'Error on earlier step',
  args: { steps: ERROR_STEPS, activeIndex: 2 },
};

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Click a step to move to it. Steps more than one ahead of the current step are disabled.' } },
  },
  render: (args) => <InteractiveStepper key={args.activeIndex} {...args} />,
};
