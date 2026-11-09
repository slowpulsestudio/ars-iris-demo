import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableRowHeader } from './ARSTableRowHeader.js';

const meta = {
  title: 'ARS/ARS_Table_Row_Header',
  component: ARSTableRowHeader,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Table_Row_Header · ARS - Primary · 2385:56534' } },
  },
} satisfies Meta<typeof ARSTableRowHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma variant "Property 1=Users" (2385:56535). */
export const Users: Story = { args: { variant: 'Users' } };

/** Figma variant "Property 1=Mixed" (2385:56545). */
export const Mixed: Story = { args: { variant: 'Mixed' } };
