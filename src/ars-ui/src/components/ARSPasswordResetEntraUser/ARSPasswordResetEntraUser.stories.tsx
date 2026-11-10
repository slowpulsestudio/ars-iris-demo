import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPasswordResetEntraUser } from './ARSPasswordResetEntraUser.js';

const meta = {
  title: 'ARS/ARS_Password_Reset_Entra_User',
  component: ARSPasswordResetEntraUser,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Password_Reset_Entra_User · ARS - Primary · 4486:19008. A 620px panel: title row with the Password icon, Reset_Content success, and the Iris UI Kit "Modal-Footer" layout with a secondary Close.',
      },
    },
  },
} satisfies Meta<typeof ARSPasswordResetEntraUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
