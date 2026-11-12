import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterSep } from './FilterSep.js';

const meta = {
  title: 'Iris new/Advanced filter/Separator',
  component: FilterSep,
  parameters: {
    docs: { description: { component: 'Figma: Iris UI Kit · .Filter, sep · 9722:11737' } },
  },
  decorators: [(Story) => <div style={{ width: 448 }}><Story /></div>],
  args: { op: 'AND' },
} satisfies Meta<typeof FilterSep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const And: Story = {};
export const Or: Story = { args: { op: 'OR' } };

/** The chip alone, which sits beside a nested group (10245:4945). */
export const Chip: Story = { args: { variant: 'chip' } };

/** A button that flips AND / OR. */
export const Toggleable: Story = { args: { onToggle: () => {} } };
