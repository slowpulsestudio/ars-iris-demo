import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps,
} from '@iris/components/MultiSelect/MultiSelect.js';
import { Button } from '@iris/components/Button/Button.js';

const GROUPS: MultiSelectOption[] = [
  { value: 'sales', title: 'Sales Division', subtitle: 'Active Directory\\Sales', icon: 'UsersThree' },
  { value: 'support', title: 'Customer Support', subtitle: 'Active Directory\\Support', icon: 'UsersThree' },
  { value: 'helpdesk', title: 'Helpdesk Operators', subtitle: 'Active Directory\\Test OU', icon: 'UsersThree' },
  { value: 'finance', title: 'Finance', subtitle: 'Active Directory\\Finance', icon: 'UsersThree' },
  { value: 'marketing', title: 'Marketing', subtitle: 'Active Directory\\Test OU', icon: 'UsersThree' },
];

function MultiSelectDemo(args: MultiSelectProps) {
  const [selected, setSelected] = useState(args.selected);
  return <MultiSelect {...args} selected={selected} onSelectionChange={setSelected} />;
}

const meta = {
  title: 'Iris/MultiSelect',
  component: MultiSelect,
  parameters: {
    docs: { description: { component: 'Popover menu for picking several items at once, with search, Select all and Clear; it stays open while items are toggled. Iris code: src/iris-shell/src/components/MultiSelect.' } },
  },
  args: {
    label: 'Groups',
    options: GROUPS,
    selected: new Set<string>(),
    onSelectionChange: () => {},
    ariaLabel: 'Filter by group',
    searchPlaceholder: 'Search groups',
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
    selected: { control: false },
  },
  render: (args) => <MultiSelectDemo {...args} />,
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  name: 'With selection',
  args: { selected: new Set(['sales', 'support']) },
};

export const DisabledOption: Story = {
  name: 'Disabled option',
  args: {
    options: [
      { value: 'domain-admins', title: 'Domain Admins', subtitle: 'Active Directory\\Users', icon: 'UsersThree', disabled: true },
      ...GROUPS,
    ],
  },
};

export const AlignEnd: Story = {
  name: 'Align end',
  args: { align: 'end' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomTrigger: Story = {
  name: 'Custom trigger',
  args: {
    renderTrigger: ({ ref, onClick, expanded, count }) => (
      <Button
        ref={ref}
        variant="secondary"
        iconLead="Funnel"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        onClick={onClick}
      >
        {count > 0 ? `Groups (${count})` : 'Groups'}
      </Button>
    ),
  },
};
