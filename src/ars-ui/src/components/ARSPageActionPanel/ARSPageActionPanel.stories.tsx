import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPageActionPanel } from './ARSPageActionPanel.js';

const meta = {
  title: 'ARS/ARS_Page_Action panel',
  component: ARSPageActionPanel,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Page_Action panel · ARS - Primary · 2944:29985. The actions are Iris links (brand for Move and Copy, danger for Delete).',
      },
    },
  },
} satisfies Meta<typeof ARSPageActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
