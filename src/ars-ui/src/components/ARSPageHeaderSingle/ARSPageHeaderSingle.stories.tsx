import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPageHeaderSingle } from './ARSPageHeaderSingle.js';

const meta = {
  title: 'ARS/ARS_Page_Header (single)',
  component: ARSPageHeaderSingle,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Page_Header · ARS - Primary · 2944:30067 (the single component, used in ARS_Group_Page; the component set with the same name is ARS_Page_Header (set)).',
      },
    },
  },
} satisfies Meta<typeof ARSPageHeaderSingle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
