import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { newCondition, type Condition } from '@iris/components/Filters/filterModel.js';
import { PARAMETERS } from '../../stories/filterSamples.js';
import { FilterValueEditor } from './FilterValueEditor.js';

function Live({ initial, parameterId }: { initial: Partial<Condition>; parameterId: string }) {
  const [condition, setCondition] = useState(() => newCondition({ parameterId, ...initial }));
  return (
    <div style={{ width: 240 }}>
      <FilterValueEditor
        condition={condition}
        parameter={PARAMETERS.find((p) => p.id === parameterId)}
        onChange={(patch) => setCondition((c) => ({ ...c, ...patch }))}
      />
    </div>
  );
}

const meta = {
  title: 'Iris new/Advanced filter/Value editor',
  component: FilterValueEditor,
  parameters: {
    docs: {
      description: {
        component:
          'The value of one condition, in the popover under a Bar pill\'s value. A field with a list of values is a checklist; "is between" is two inputs; anything else is one input. ' +
          'Figma: Iris UI Kit · Advanced Filter Bar value menu (FilterSelect) 9710:8598.',
      },
    },
  },
} satisfies Meta<typeof FilterValueEditor>;

export default meta;
type Story = StoryObj;

/** A field with a list of values and "is one of". */
export const Checklist: Story = { render: () => <Live parameterId="objectType" initial={{ operatorId: 'in' }} /> };

/** "contains" on a text field. */
export const Text: Story = { render: () => <Live parameterId="displayName" initial={{ operatorId: 'contains' }} /> };
