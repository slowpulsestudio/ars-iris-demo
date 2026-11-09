import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionBar, type ActionBarProps, type ActionItem } from '@iris/components/ActionBar/ActionBar.js';
import { Button } from '@iris/components/Button/Button.js';
import { Pagination } from '@iris/components/Pagination/Pagination.js';

// Bulk actions from the Users page.
const USER_ACTIONS: ActionItem[][] = [
  [
    { icon: 'SelectionAll', label: 'Select all' },
    { icon: 'Copy', label: 'Copy' },
    { icon: 'Folder', label: 'Move' },
    { icon: 'UserList', label: 'Properties' },
    // Signature action: never collapses to icon-only.
    { icon: 'Sparkle', label: 'Ask AI', tone: 'brand', beam: true, iconOnly: false },
  ],
  [{ icon: 'Trash', label: 'Delete', tone: 'danger' }],
];

function ActionBarDemo(args: ActionBarProps) {
  const [open, setOpen] = useState(args.open);
  const [selectedCount, setSelectedCount] = useState(args.selectedCount);
  // Select all selects every row, as on the Users page.
  const groups = args.groups.map((group) =>
    group.map((item) =>
      item.label === 'Select all' ? { ...item, onClick: () => setSelectedCount(args.totalCount) } : item,
    ),
  );
  return (
    <>
      <Button
        onClick={() => {
          setSelectedCount(args.selectedCount);
          setOpen(true);
        }}
      >
        Show action bar
      </Button>
      {/* The inline bar covers the pagination footer below the table, as on the Users page. */}
      {args.layout === 'inline' && (
        <div
          style={{
            marginTop: 'var(--oi-spacing-xl)',
            padding: 'var(--oi-spacing-m) var(--oi-spacing-xl)',
            containerType: 'inline-size',
            borderTop: 'var(--oi-border-width-default) var(--oi-border-style-solid) var(--oi-border-color-muted)',
          }}
        >
          <Pagination
            page={1}
            pageCount={5}
            onPageChange={() => {}}
            pageSize={20}
            onPageSizeChange={() => {}}
            ariaLabel="Users pages"
          />
        </div>
      )}
      <ActionBar
        {...args}
        open={open}
        selectedCount={selectedCount}
        groups={groups}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: 'Iris/ActionBar',
  component: ActionBar,
  parameters: {
    docs: { description: { component: 'Fixed bottom-centered floating toolbar that appears while a selection is active. Iris code: src/iris-shell/src/components/ActionBar.' } },
  },
  args: { open: true, selectedCount: 2, totalCount: 95, groups: USER_ACTIONS },
  argTypes: {
    layout: { control: 'inline-radio', options: ['floating', 'inline'] },
    groups: { control: false },
  },
  render: (args) => <ActionBarDemo key={`${args.open}-${args.selectedCount}`} {...args} />,
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Users page bulk actions with 2 of 95 users selected. Select all selects every user. Close the bar with its X button or Esc; Show action bar brings it back.' } },
  },
};

export const Inline: Story = {
  parameters: {
    docs: { description: { story: 'How the Users and directory pages show it: in the page, over the pagination footer, instead of floating at the bottom of the window.' } },
  },
  args: { layout: 'inline' },
};

export const DisabledActions: Story = {
  name: 'Disabled actions',
  args: {
    groups: USER_ACTIONS.map((group) =>
      group.map((item) => (item.label === 'Move' || item.label === 'Delete' ? { ...item, disabled: true } : item)),
    ),
  },
};

export const IconOnly: Story = {
  name: 'Icon only',
  parameters: {
    docs: { description: { story: 'Every action except Ask AI shows only its icon; hover or focus one to see its label. Ask AI keeps its label because it sets iconOnly to false.' } },
  },
  args: {
    groups: USER_ACTIONS.map((group) => group.map((item) => ({ ...item, iconOnly: item.iconOnly ?? true }))),
  },
};

export const NarrowContainer: Story = {
  name: 'Narrow container',
  parameters: {
    docs: { description: { story: 'When the labelled actions no longer fit, they shrink to icons on their own; hover or focus one to see its label. Ask AI keeps its label.' } },
  },
  args: { layout: 'inline' },
  decorators: [
    (Story) => (
      // Narrower than the bar with every label showing.
      <div style={{ maxWidth: 'calc(var(--oi-spacing-128) * 4)' }}>
        <Story />
      </div>
    ),
  ],
};
