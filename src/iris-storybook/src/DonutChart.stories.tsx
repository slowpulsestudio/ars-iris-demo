import type { Meta, StoryObj } from '@storybook/react-vite';
import { DonutChart, type DonutSegment } from '@iris/components/DonutChart/DonutChart.js';

const USERS_BY_STATUS: DonutSegment[] = [
  { label: 'Active', value: 71840 },
  { label: 'Disabled', value: 3912 },
  { label: 'Locked', value: 418 },
  { label: 'Expired', value: 1066 },
];

const meta = {
  title: 'Iris/DonutChart',
  component: DonutChart,
  parameters: {
    docs: { description: { component: 'Minimal SVG donut chart with a legend. Iris code: src/iris-shell/src/components/DonutChart.' } },
  },
  // The app's card surface: the muted ring track barely shows on the grey canvas.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 'var(--oi-spacing-m)', backgroundColor: 'var(--oi-background-color-primary)' }}>
        <Story />
      </div>
    ),
  ],
  args: { segments: USERS_BY_STATUS },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThinRing: Story = { name: 'Thin ring', args: { strokeWidth: 10 } };

export const SingleSegment: Story = {
  name: 'Single segment',
  args: { segments: [{ label: 'Active', value: 71840 }] },
};

export const AllZero: Story = {
  name: 'All zero',
  parameters: {
    docs: { description: { story: 'No users yet. Only the empty ring track shows and the total reads 0.' } },
  },
  args: { segments: USERS_BY_STATUS.map(({ label }) => ({ label, value: 0 })) },
};
