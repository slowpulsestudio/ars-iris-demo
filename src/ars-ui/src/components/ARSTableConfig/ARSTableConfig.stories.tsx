import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableConfig } from './ARSTableConfig.js';

const meta = {
  title: 'ARS/ARS_Table_Config',
  component: ARSTableConfig,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Table_Config · ARS - Primary · 3663:19416' } },
  },
} satisfies Meta<typeof ARSTableConfig>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
