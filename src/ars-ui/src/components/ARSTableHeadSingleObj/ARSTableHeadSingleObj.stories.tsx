import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableHeadSingleObj } from './ARSTableHeadSingleObj.js';

const meta = {
  title: 'ARS/ARS.Table head_single_obj',
  component: ARSTableHeadSingleObj,
  parameters: {
    docs: { description: { component: 'Figma: ARS.Table head_single_obj · ARS - Primary · 3423:27419' } },
  },
} satisfies Meta<typeof ARSTableHeadSingleObj>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
