import type { Meta, StoryObj } from '@storybook/react-vite';
import { useFilterModel } from '@iris/components/Filters/useFilterModel.js';
import { appendChild, newCondition, newGroup, type Group } from '@iris/components/Filters/filterModel.js';
import { CATEGORIES, PARAMETERS, barFilter } from '../../stories/filterSamples.js';
import { FilterBarGroup } from './FilterBarGroup.js';

function Live({ initial }: { initial: () => Group }) {
  const { root, actions } = useFilterModel(initial());
  const card = root.children.find((n): n is Group => n.kind === 'group');
  if (!card) return null;
  return (
    <div style={{ width: 'max-content', padding: 'var(--oi-spacing-m)', background: 'var(--oi-background-color-primary)', boxShadow: 'var(--oi-shadow-high)', borderRadius: 'var(--oi-border-radius-l)' }}>
      <FilterBarGroup
        group={card}
        parameters={PARAMETERS}
        categories={CATEGORIES}
        onAddCondition={(parentId, parameterId) => actions.replace(appendChild(root, parentId, newCondition({ parameterId })))}
        onAddGroup={(parentId) => actions.replace(appendChild(root, parentId, newGroup('and')))}
        onRemove={actions.remove}
        onSetOp={actions.setOp}
        onEditCondition={() => undefined}
      />
    </div>
  );
}

const meta = {
  title: 'Iris new/Advanced filter/Bar group',
  component: FilterBarGroup,
  parameters: {
    docs: {
      description: {
        component:
          'What the Bar popover holds: conditions as pills, groups as grey cards (dashed when nested), AND/OR chips and "+ Filter". ' +
          'Figma: Iris UI Kit · Default, interactions 10126:4485 · Nesting, interactions 10153:4683.',
      },
    },
  },
} satisfies Meta<typeof FilterBarGroup>;

export default meta;
type Story = StoryObj;

/** A new filter: only "+ Filter" (10126:3944). */
export const Empty: Story = { render: () => <Live initial={() => newGroup('and', [newGroup('and')])} /> };

/** The sample filter's first pill opened. */
export const Filled: Story = { render: () => <Live initial={barFilter} /> };
