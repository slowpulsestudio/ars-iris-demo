import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@iris/components/Spinner/Spinner.js';

const meta = {
  title: 'Iris/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: 'Loading indicator (Iris UI Kit "Spinner"). Iris code: src/iris-shell/src/components/Spinner.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'default', 'l'] },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Scenario=Loop". */
export const Loop: Story = {};

/** UI Kit "Scenario=Completion": known progress. */
export const KnownProgress: Story = { name: 'Known progress', args: { progress: 0.6 } };

/** UI Kit sizes: Small 16, Default 24, Large 40. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-l)' }}>
      <Spinner {...args} size="s" />
      <Spinner {...args} size="default" />
      <Spinner {...args} size="l" />
    </div>
  ),
};
