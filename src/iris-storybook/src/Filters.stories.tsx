import { Fragment, useState, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AdvancedFilter,
  ConditionPill,
  FilterBar,
  OPERATOR_BY_ID,
  ValueEditor,
  newCondition,
  newGroup,
  useFilterModel,
  type ConditionPillProps,
  type FilterBarProps,
  type FilterModelActions,
  type FilterOption,
  type ParamCategory,
  type ParameterDef,
  type ValueEditorProps,
} from '@iris/components/Filters/index.js';
import pill from '@iris/components/Filters/ConditionPill.module.css';
import { Button } from '@iris/components/Button/Button.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { cx } from '@iris/lib/cx.js';

const TEST_OU = 'Active Directory\\Test OU';

// Statuses and their badge icons from the Users page.
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'active', label: 'Active', icon: 'CheckCircle' },
  { value: 'inactive', label: 'Inactive', icon: 'XCircle' },
  { value: 'disabled', label: 'Disabled', icon: 'XCircle' },
  { value: 'unknown', label: 'Unknown', icon: 'WarningCircle' },
  { value: 'pending', label: 'Pending', icon: 'WarningCircle' },
];

// Departments from the Insights page.
const DEPARTMENT_OPTIONS: FilterOption[] = [
  { value: 'it-operations', label: 'IT Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'security', label: 'Security' },
];

const PARAMETERS: ParameterDef[] = [
  { id: 'name', label: 'Name', icon: 'TextAa' },
  { id: 'status', label: 'Status', icon: 'UserCircleCheck', options: STATUS_OPTIONS },
  { id: 'department', label: 'Department', icon: 'Buildings', options: DEPARTMENT_OPTIONS },
  { id: 'location', label: 'Location', icon: 'MapPin' },
  { id: 'dateCreated', label: 'Date created', icon: 'CalendarDots', date: true },
];

const CATEGORIES: ParamCategory[] = [
  { label: 'Common', parameterIds: ['name', 'location'] },
  { label: 'User', parameterIds: ['status', 'department', 'dateCreated'] },
];

const BAR_FILTERS = newGroup('and', [
  newCondition({ parameterId: 'status', operatorId: 'eq', values: ['active'] }),
  newCondition({ parameterId: 'location', operatorId: 'eq', values: [TEST_OU] }),
  newGroup('or', [
    newCondition({ parameterId: 'department', operatorId: 'in', values: ['it-operations', 'security'] }),
    newCondition({ parameterId: 'name', operatorId: 'contains', values: ['Clark'] }),
  ]),
]);

const BUILDER_FILTERS = newGroup('and', [
  newCondition({ parameterId: 'status', operatorId: 'in', values: ['inactive', 'disabled'] }),
  newCondition({ parameterId: 'location', operatorId: 'eq', values: [TEST_OU] }),
  newGroup('or', [
    newCondition({ parameterId: 'department', operatorId: 'eq', values: ['finance'] }),
    newCondition({ parameterId: 'name', operatorId: 'contains', values: ['Clark'] }),
  ]),
]);

const PILL_CONDITIONS = [
  newCondition({ parameterId: 'name', operatorId: 'contains', values: ['Clark'] }),
  newCondition({ parameterId: 'department', operatorId: 'in', values: ['it-operations', 'security'] }),
  newCondition({ parameterId: 'location', operatorId: 'empty' }),
  newCondition(),
];

const VALUE_CONDITIONS = [
  newCondition({ parameterId: 'name', operatorId: 'contains', values: ['Clark'] }),
  newCondition({ parameterId: 'status', operatorId: 'in', values: ['active'] }),
  newCondition({ parameterId: 'dateCreated', operatorId: 'gte', values: ['2026-01-01'] }),
];

// Placeholder for the required prop; the demos pass useFilterModel's actions instead.
const NO_ACTIONS: FilterModelActions = {
  addCondition: () => {},
  addGroup: () => {},
  updateCondition: () => {},
  remove: () => {},
  setOp: () => {},
  clear: () => {},
  replace: () => {},
};

function FilterBarDemo(args: FilterBarProps) {
  const { root, actions } = useFilterModel(args.root);
  // Same menu as the Users page's Filter button: Advanced filter, then one entry per parameter.
  const addMenuItems: MenuEntry[] = [
    {
      kind: 'item',
      label: 'Advanced filter',
      icon: 'FunnelSimple',
      onSelect: () => actions.addGroup(root.id),
      disabled: root.children.filter((c) => c.kind === 'group').length >= 6,
    },
    { kind: 'divider' },
    ...args.parameters.map<MenuEntry>((p) => ({
      kind: 'item',
      label: p.label,
      onSelect: () => actions.addCondition(root.id, { parameterId: p.id }),
    })),
  ];

  // The bar renders nothing once every filter is removed, so offer the menu to start again.
  if (root.children.length === 0) {
    return (
      <Menu
        ariaLabel="Add filter"
        align="start"
        items={addMenuItems}
        trigger={({ ref, onClick, expanded }) => (
          <Button
            ref={ref as Ref<HTMLButtonElement>}
            variant="secondary"
            iconLead="Plus"
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          >
            Add filter
          </Button>
        )}
      />
    );
  }

  return <FilterBar {...args} root={root} actions={actions} addMenuItems={addMenuItems} />;
}

function AdvancedFilterDemo(args: FilterBarProps) {
  const { root, actions } = useFilterModel(args.root);
  return (
    <AdvancedFilter group={root} parameters={args.parameters} categories={args.categories} actions={actions} />
  );
}

function ConditionPillDemo(args: Pick<ConditionPillProps, 'condition' | 'parameters'>) {
  const [condition, setCondition] = useState(args.condition);
  const [removed, setRemoved] = useState(false);
  if (removed) return null;
  return (
    <ConditionPill
      condition={condition}
      parameters={args.parameters}
      onChange={(patch) => setCondition((current) => ({ ...current, ...patch }))}
      onRemove={() => setRemoved(true)}
    />
  );
}

function ValueEditorDemo(args: Pick<ValueEditorProps, 'parameter' | 'operatorId' | 'values'>) {
  const [values, setValues] = useState(args.values);
  // Inside the pill border, with the same segment classes ConditionPill passes it.
  return (
    <div className={pill.pill}>
      <ValueEditor
        {...args}
        values={values}
        onChange={setValues}
        segClassName={cx(pill.seg, pill.segValue)}
        inputClassName={cx(pill.seg, pill.segValue, pill.valueInput)}
        placeholderClassName={pill.placeholder}
      />
    </div>
  );
}

const meta = {
  title: 'Iris/Filters',
  component: FilterBar,
  parameters: {
    docs: { description: { component: 'Active-filter band beneath the toolbar, where each filter is an editable condition pill or an advanced group that opens a filter builder. Iris code: src/iris-shell/src/components/Filters.' } },
  },
  args: { root: BAR_FILTERS, parameters: PARAMETERS, categories: CATEGORIES, actions: NO_ACTIONS },
  argTypes: {
    root: { control: false },
    parameters: { control: false },
    categories: { control: false },
    actions: { control: false },
    addMenuItems: { control: false },
  },
  render: (args) => <FilterBarDemo {...args} />,
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterBarStory: Story = {
  name: 'FilterBar',
  parameters: {
    docs: { description: { story: 'Two condition pills and an advanced filter group. Click any part of a pill to change it, click the advanced filter to open its builder, or use + to add a filter. When every filter is removed the bar disappears, as in the app.' } },
  },
};

export const AdvancedFilterStory: Story = {
  name: 'AdvancedFilter',
  parameters: {
    docs: { description: { story: 'The builder that opens from an advanced filter pill. Click AND or OR to switch how a group joins its filters; + Filter adds a filter or a nested group, up to three levels deep.' } },
  },
  args: { root: BUILDER_FILTERS },
  // Sized to its content, like the dropdown it opens in.
  decorators: [
    (Story) => (
      <div style={{ width: 'max-content' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <AdvancedFilterDemo {...args} />,
};

export const ConditionPillStory: Story = {
  name: 'ConditionPill',
  parameters: {
    docs: { description: { story: 'Pick a parameter and an operator from their menus, then set the value. Is empty takes no value, and the last pill is a new condition before anything is chosen.' } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--oi-spacing-m)' }}>
      {PILL_CONDITIONS.map((condition) => (
        <ConditionPillDemo key={condition.id} condition={condition} parameters={args.parameters} />
      ))}
    </div>
  ),
};

export const ValueEditorStory: Story = {
  name: 'ValueEditor',
  parameters: {
    docs: { description: { story: 'The value part of a condition pill. The parameter decides the control: a text box, a list of values or a date field. It shows nothing for the is empty operator.' } },
  },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'max-content max-content',
        justifyItems: 'start',
        alignItems: 'center',
        gap: 'var(--oi-spacing-m) var(--oi-spacing-l)',
      }}
    >
      {VALUE_CONDITIONS.map((condition) => {
        const parameter = args.parameters.find((p) => p.id === condition.parameterId);
        return (
          <Fragment key={condition.id}>
            <span style={{ color: 'var(--oi-content-color-secondary)' }}>
              {parameter.label} {OPERATOR_BY_ID[condition.operatorId].label}
            </span>
            <ValueEditorDemo parameter={parameter} operatorId={condition.operatorId} values={condition.values} />
          </Fragment>
        );
      })}
    </div>
  ),
};
