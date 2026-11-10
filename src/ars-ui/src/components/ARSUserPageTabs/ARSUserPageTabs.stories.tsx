import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUserPageTabs } from './ARSUserPageTabs.js';

const meta = {
  title: 'ARS/ARS_User_Page_Tabs',
  component: ARSUserPageTabs,
  parameters: {
    docs: { description: { component: 'Figma: ARS_User_Page_Tabs · ARS - Primary · 3598:46761. Built with the Iris Tabs.' } },
  },
} satisfies Meta<typeof ARSUserPageTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
