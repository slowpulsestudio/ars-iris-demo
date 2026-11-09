import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from '@iris/components/StatCard/StatCard.js';

const meta = {
  title: 'Iris/StatCard',
  component: StatCard,
  parameters: {
    docs: { description: { component: 'A single hero metric tile. Iris code: src/iris-shell/src/components/StatCard.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Managed Users', value: '77,236' },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TrendUp: Story = {
  name: 'Trend up',
  args: { trend: { direction: 'up', value: '2.4% vs last week', tone: 'success' } },
};

export const TrendDown: Story = {
  name: 'Trend down',
  args: { trend: { direction: 'down', value: '0.8% vs last week', tone: 'danger' } },
};

export const Warning: Story = {
  args: {
    label: 'Managed Units',
    value: '141',
    trend: { direction: 'warning', value: '11 broken links', tone: 'warning' },
  },
};
