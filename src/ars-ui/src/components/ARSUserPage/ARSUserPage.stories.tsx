import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUserPage } from './ARSUserPage.js';

const meta = {
  title: 'ARS/ARS_User_Page',
  component: ARSUserPage,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Figma: ARS_User_Page · ARS - Primary · 3129:8132' } },
  },
  decorators: [(Story) => <div style={{ height: 930 }}><Story /></div>],
} satisfies Meta<typeof ARSUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=Default" (2905:26769). */
export const Default: Story = {};
