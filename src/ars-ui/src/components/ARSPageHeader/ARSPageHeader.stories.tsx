import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPageHeader } from './ARSPageHeader.js';

const meta = {
  title: 'ARS/ARS_Page_Header (set)',
  component: ARSPageHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Page_Header · ARS - Primary · 3066:57118 (the component set; a single component with the same name is ARS_Page_Header (single)). Variant3 is drawn the same as Device.',
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['User', 'Device', 'Variant3'] } },
} satisfies Meta<typeof ARSPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=User" (2905:26789). */
export const User: Story = { args: { variant: 'User' } };

/** Figma "Property 1=Device" (3066:57119). */
export const Device: Story = { args: { variant: 'Device' } };

/** Figma "Property 1=Variant3" (3066:57139). */
export const Variant3: Story = { args: { variant: 'Variant3' } };
