import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart, type BarDatum } from '@iris/components/BarChart/BarChart.js';

const USERS_BY_DIRECTORY: BarDatum[] = [
  { label: 'Azure AD', value: 28400 },
  { label: 'Active Dir', value: 21800 },
  { label: 'Google', value: 16200 },
  { label: 'Okta', value: 10836 },
];

const USERS_BY_REGION: BarDatum[] = [
  { label: 'US East', value: 34000 },
  { label: 'EU West', value: 19500 },
  { label: 'Asia', value: 14200 },
  { label: 'LATAM', value: 9500 },
];

const meta = {
  title: 'Iris/BarChart',
  component: BarChart,
  parameters: {
    docs: { description: { component: 'Minimal SVG bar chart. Iris code: src/iris-shell/src/components/BarChart.' } },
  },
  // The app's card surface: the muted gridlines barely show on the grey canvas.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 'var(--oi-spacing-m)', backgroundColor: 'var(--oi-background-color-primary)' }}>
        <Story />
      </div>
    ),
  ],
  args: { data: USERS_BY_DIRECTORY },
  argTypes: { color: { control: 'inline-radio', options: ['blue', 'purple'] } },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purple: Story = { args: { color: 'purple', data: USERS_BY_REGION } };

export const Height: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Height changes the drawing's internal height, not the chart's size on screen. The chart's styles keep its on-screen height fixed, so other values stretch or squash the drawing, most visibly the axis labels.",
      },
    },
  },
  args: { height: 300 },
};

export const SingleValue: Story = {
  name: 'Single value',
  args: { data: [{ label: 'Active Dir', value: 21800 }] },
};

export const AllZero: Story = {
  name: 'All zero',
  parameters: {
    docs: { description: { story: 'No locked users in any directory. The bars sit flat on the baseline and the axis falls back to a 0 to 1 scale.' } },
  },
  args: { data: USERS_BY_DIRECTORY.map(({ label }) => ({ label, value: 0 })) },
};
