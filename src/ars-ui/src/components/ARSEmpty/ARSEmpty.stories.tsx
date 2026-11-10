import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSEmpty } from './ARSEmpty.js';

const meta = {
  title: 'ARS/Missing from Figma/Empty',
  component: ARSEmpty,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: Empty · ARS_WebUI2_CRUD · 1369:31209. The Tree view main content with no directory or folder selected.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 930, boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ARSEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
