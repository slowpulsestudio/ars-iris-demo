import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableToolbar } from './ARSTableToolbar.js';

const meta = {
  title: 'ARS/ARS_Table_Toolbar',
  component: ARSTableToolbar,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Table_Toolbar · ARS - Primary · 2613:23294' } },
  },
} satisfies Meta<typeof ARSTableToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Vartiant=Split" (82:28898). */
export const Split: Story = { args: { variant: 'Split' } };

/** Figma "Vartiant=Basic" (2613:23295). */
export const Basic: Story = { args: { variant: 'Basic' } };

/** Figma "Vartiant=No create" (3306:19725). */
export const NoCreate: Story = { name: 'No create', args: { variant: 'No create' } };

/** Figma "Vartiant=4" (4198:23796). */
export const Four: Story = { name: '4', args: { variant: '4' } };
