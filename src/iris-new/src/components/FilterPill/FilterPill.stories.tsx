import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterPill } from './FilterPill.js';

const meta = {
  title: 'Iris new/Advanced filter/Pill',
  component: FilterPill,
  parameters: {
    docs: {
      description: { component: 'Figma: Iris UI Kit · .Advanced filter bar, pill · 10052:6218' },
    },
  },
  args: { parameter: { label: 'Object type', icon: 'Lego' } },
} satisfies Meta<typeof FilterPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Variant "Default": parameter only, with the × (10012:2128). */
export const Parameter: Story = { args: { parameter: { label: 'Parameter', icon: 'DiamondsFour' } } };

/** Parameter, operator and value (10012:3825). */
export const Condition: Story = {
  args: { operator: { label: 'contains', icon: 'SupersetProperOf' }, value: 'Project 21234' },
};

/** Operator not chosen yet: the muted "operator" placeholder (Variant2). */
export const OperatorPlaceholder: Story = {
  args: { parameter: { label: 'Parameter', icon: 'DiamondsFour' }, operator: { label: 'operator', icon: 'DiamondsFour' } },
};

/** "and 3 more conditions" (Variant3 + Variant6). */
export const WithMore: Story = {
  args: {
    operator: { label: 'contains', icon: 'SupersetProperOf' },
    value: 'Project 21234',
    more: { connector: 'and', count: 3 },
  },
};

/** Joined with "or". */
export const WithMoreOr: Story = {
  args: {
    parameter: { label: 'Member of', icon: 'Lego' },
    operator: { label: 'matches', icon: 'ApproximateEquals' },
    value: 'Support team',
    more: { connector: 'or', count: 2 },
  },
};

/** "is between": the two ends in one value. Not in the Iris UI Kit yet. */
export const Between: Story = {
  args: {
    parameter: { label: 'Date active', icon: 'CalendarDots' },
    operator: { label: 'is between', icon: 'ArrowsLeftRight' },
    value: '2026-05-01 and 2026-05-28',
  },
};

/** No icons (10012:4749). */
export const WithoutIcons: Story = {
  args: { parameter: { label: 'Created date' }, operator: { label: 'greater than or equals' }, value: '2026-09-21' },
};

/** Before any condition exists: the grey "Advanced filter" pill (10052:6220). */
export const Empty: Story = { args: { empty: true, parameter: { label: 'Advanced filter', icon: 'FunnelSimple' } } };

/** Each segment is a button once `onEdit` is given; hover and focus follow the Figma cursor frames. */
export const Interactive: Story = {
  args: {
    operator: { label: 'contains', icon: 'SupersetProperOf' },
    value: 'Project 21234',
    more: { connector: 'and', count: 3 },
    onEdit: () => {},
    onRemove: () => {},
  },
};
