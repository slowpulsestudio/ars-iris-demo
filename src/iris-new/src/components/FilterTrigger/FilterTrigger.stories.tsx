import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterTrigger } from './FilterTrigger.js';

const meta = {
  title: 'Iris new/Advanced filter/Filter trigger',
  component: FilterTrigger,
  parameters: {
    docs: { description: { component: 'Figma: Iris UI Kit · Content header Filter button + .dot-indicator · 10012:3544, 10012:4733' } },
  },
} satisfies Meta<typeof FilterTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoFilter: Story = {};
export const FilterApplied: Story = { args: { active: true } };
