import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUserPageHeader } from './ARSUserPageHeader.js';

const meta = {
  title: 'ARS/ARS_User_Page_Header',
  component: ARSUserPageHeader,
  parameters: {
    docs: { description: { component: 'Figma: ARS_User_Page_Header · ARS - Primary · 3598:47947' } },
  },
} satisfies Meta<typeof ARSUserPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
