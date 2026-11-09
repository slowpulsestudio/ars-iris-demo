import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@iris/components/Badge/Badge.js';

const TONES = ['neutral', 'info', 'success', 'warning', 'error'] as const;

const meta = {
  title: 'Iris/Badge',
  component: Badge,
  parameters: {
    docs: { description: { component: 'Short status or category indicator. Iris code: src/iris-shell/src/components/Badge.' } },
  },
  args: { children: 'Active' },
  argTypes: { tone: { control: 'inline-radio', options: TONES } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--oi-spacing-s)' }}>
      {TONES.map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'With icon',
  args: { tone: 'success', icon: 'CheckCircle', children: 'Enabled' },
};
