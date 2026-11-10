import type { Meta, StoryObj } from '@storybook/react-vite';
import { DurationTokens, EasingTokens } from './MotionDemo.js';

const meta = {
  title: 'Motion/Tokens',
  parameters: {
    docs: {
      description: {
        component:
          'The Iris motion tokens (--oi-motion-*) with their live values. New work uses the semantic tokens; never hard-code durations or easings.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Durations: Story = {
  render: () => (
    <DurationTokens
      tokens={[
        '--oi-motion-duration-snap',
        '--oi-motion-duration-short',
        '--oi-motion-duration-default',
        '--oi-motion-duration-long',
        '--oi-motion-duration-loop',
      ]}
    />
  ),
};

export const Easings: Story = {
  render: () => (
    <EasingTokens
      groups={[
        {
          title: 'Semantic',
          tokens: [
            '--oi-motion-ease-default',
            '--oi-motion-ease-enter',
            '--oi-motion-ease-exit',
            '--oi-motion-ease-drawer',
            '--oi-motion-ease-none',
          ],
        },
        {
          title: 'Primitive',
          tokens: ['--oi-motion-ease-emphasized', '--oi-motion-ease-linear', '--oi-motion-ease-out', '--oi-motion-ease-in'],
        },
      ]}
    />
  ),
};
