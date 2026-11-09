import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableHeadMixedObj } from './ARSTableHeadMixedObj.js';

const meta = {
  title: 'ARS/ARS.Table head_Mixed_obj',
  component: ARSTableHeadMixedObj,
  parameters: {
    docs: { description: { component: 'Figma: ARS.Table head_Mixed_obj · ARS - Primary · 3423:28002' } },
  },
} satisfies Meta<typeof ARSTableHeadMixedObj>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
