import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart, type LineDatum } from '@iris/components/LineChart/LineChart.js';

const RESPONSE_HOURS: LineDatum[] = [
  { label: 'Jan', value: 21 },
  { label: 'Feb', value: 32 },
  { label: 'Mar', value: 27 },
  { label: 'Apr', value: 39 },
  { label: 'May', value: 34 },
  { label: 'Jun', value: 43 },
];

const meta = {
  title: 'Iris/LineChart',
  component: LineChart,
  parameters: {
    docs: {
      description: {
        component:
          'Minimal SVG line chart, drawn like BarChart. Added for the Response Time card in ARS_WebUI2_User-View-Approvals (home-dashboard 10199:6772); Iris had no line chart. Iris code: src/iris-shell/src/components/LineChart.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 'var(--oi-spacing-m)', backgroundColor: 'var(--oi-background-color-primary)' }}>
        <Story />
      </div>
    ),
  ],
  args: { data: RESPONSE_HOURS, unit: 'h' },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoUnit: Story = { name: 'No unit', args: { unit: '' } };

export const SingleValue: Story = { name: 'Single value', args: { data: [{ label: 'Jan', value: 21 }] } };
