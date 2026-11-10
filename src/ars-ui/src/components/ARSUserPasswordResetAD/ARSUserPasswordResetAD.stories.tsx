import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUserPasswordResetAD } from './ARSUserPasswordResetAD.js';

const meta = {
  title: 'ARS/ARS_User_Password_Reset_AD',
  component: ARSUserPasswordResetAD,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_User_Password_Reset_AD · ARS - Primary · 4486:18890. Iris FormField with the help message, password fields with copy and show / hide, Iris Checkboxes, the Iris Spinner while resetting, then Reset_Content success. Reset password stays disabled until the fields are filled.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Empty', 'Filled', 'wait', 'Success'] },
  },
} satisfies Meta<typeof ARSUserPasswordResetAD>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Empty" (4486:18891). */
export const Empty: Story = { args: { variant: 'Empty' } };

/** Figma "Property 1=Filled" (4486:18924). */
export const Filled: Story = { args: { variant: 'Filled' } };

/** Figma "Property 1=wait" (4486:18957). */
export const Wait: Story = { name: 'wait', args: { variant: 'wait' } };

/** Figma "Property 1=Success" (4486:18974). */
export const Success: Story = { args: { variant: 'Success' } };
