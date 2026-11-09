import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSRow } from './ARSRow.js';

const meta = {
  title: 'ARS/ARS_Row',
  component: ARSRow,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Row · ARS - Primary · 111:29461' } },
  },
} satisfies Meta<typeof ARSRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma variant "Property 1=User" (82:28900). */
export const User: Story = {
  args: {
    variant: 'User',
    name: 'Sophia Reyes',
    status: 'Active',
    description: 'Leads platform engineering, oversees infra and security compliance across all regions.',
    tags: ['Design', 'Engineering'],
    location: 'AD1\\Users',
  },
};

/** Figma variant "Property 1=Mixed" (111:29462). */
export const Mixed: Story = {
  args: {
    variant: 'Mixed',
    name: 'Sophia Reyes',
    objectType: 'User',
    tags: ['Design', 'Engineering'],
    location: 'AD1\\Users',
  },
};
