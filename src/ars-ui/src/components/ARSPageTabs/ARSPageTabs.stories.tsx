import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPageTabs } from './ARSPageTabs.js';

const meta = {
  title: 'ARS/ARS_Page_Tabs',
  component: ARSPageTabs,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Page_Tabs · ARS - Primary · 2944:30035. Built with the Iris Tabs. Figma always draws the "•••" button at the end; the Iris Tabs shows it only when the tabs don\'t fit.',
      },
    },
  },
} satisfies Meta<typeof ARSPageTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
