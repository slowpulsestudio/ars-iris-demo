import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { newCondition, type Condition } from '@iris/components/Filters/filterModel.js';
import { PARAMETERS } from '../../stories/filterSamples.js';
import { FilterCondition } from './FilterCondition.js';

function Live({ initial, width }: { initial: Condition; width: number }) {
  const [condition, setCondition] = useState(initial);
  return (
    <div style={{ width, containerType: 'inline-size' }}>
      <FilterCondition
        condition={condition}
        parameters={PARAMETERS}
        onChange={(patch) => setCondition((c) => ({ ...c, ...patch }))}
        onRemove={() => setCondition(newCondition())}
      />
    </div>
  );
}

const meta = {
  title: 'Iris new/Advanced filter/Condition',
  component: FilterCondition,
  parameters: {
    docs: {
      description: {
        component: 'Figma: Iris UI Kit · .Parameter 9950:2946, .Operator 9950:3029, .tree trail 9722:13236',
      },
    },
  },
} satisfies Meta<typeof FilterCondition>;

export default meta;
type Story = StoryObj;

/** Nothing chosen yet. */
export const Empty: Story = { render: () => <Live initial={newCondition()} width={448} /> };

/** Filled in, with a date value. */
export const Filled: Story = {
  render: () => (
    <Live initial={newCondition({ parameterId: 'created', operatorId: 'gte', values: ['2026-08-01'] })} width={448} />
  ),
};

/** "is between": two dates joined by "and". Not in the Iris UI Kit yet; the ARS Favorites filter area draws it (4145:13714). */
export const Between: Story = {
  render: () => (
    <Live initial={newCondition({ parameterId: 'created', operatorId: 'between', values: ['2026-05-01', '2026-05-28'] })} width={448} />
  ),
};

/** The parameter has a value list, so the value is a picker. */
export const WithValueList: Story = {
  render: () => (
    <Live initial={newCondition({ parameterId: 'objectType', operatorId: 'in', values: ['user', 'group'] })} width={448} />
  ),
};

/** Narrow (the panel's min-width): the controls stack along the tree trail. */
export const Narrow: Story = { render: () => <Live initial={newCondition()} width={274} /> };
