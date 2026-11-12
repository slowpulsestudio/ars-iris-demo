import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterJoinButton } from './FilterJoinButton.js';

const meta = {
  title: 'Iris new/Advanced filter/Join button',
  component: FilterJoinButton,
  parameters: {
    docs: { description: { component: 'Figma: Iris UI Kit · .And · 9722:11499' } },
  },
  args: { op: 'AND' },
} satisfies Meta<typeof FilterJoinButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const And: Story = {};
export const Or: Story = { args: { op: 'OR' } };
