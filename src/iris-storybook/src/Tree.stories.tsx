import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree, type TreeNode } from '@iris/components/Tree/Tree.js';
import { Icon } from '@iris/components/Icon/Icon.js';

const trailing = (
  <>
    <Icon name="DotsThreeVertical" size="16px" />
    <Icon name="CaretRight" size="12px" />
  </>
);

const folder = { icon: 'Folder', openIcon: 'FolderOpen' };

const leaf = (id: string, label: string): TreeNode => ({
  id,
  label,
  ...folder,
  children: [{ id: `${id}-x`, label: 'Placeholder', ...folder, trailing }],
  trailing,
});

// Content of the UI Kit "Tree" example.
const NODES: TreeNode[] = [
  {
    id: 'ad',
    label: 'Active Directory',
    ...folder,
    trailing,
    children: [
      {
        id: 'o1d',
        label: 'O1D.local',
        ...folder,
        trailing,
        children: [
          leaf('builtin', 'Builtin'),
          leaf('computers', 'Computers'),
          leaf('dg-tests', 'DG-Tests'),
          leaf('dc', 'Domain Controllers'),
          leaf('fsp', 'Foreign Security Principals'),
          leaf('keys', 'Keys'),
          leaf('msa', 'Managed Service Accounts'),
          leaf('program-data', 'Program Data'),
          leaf('system', 'System'),
          { id: 'test-ou', label: 'Test OU', ...folder, trailing, children: [leaf('users', 'Users')] },
        ],
      },
    ],
  },
];

const meta = {
  title: 'Iris/Tree',
  component: Tree,
  parameters: {
    docs: {
      description: {
        component:
          'Hierarchical list (Iris UI Kit "Tree"): trail lines, caret, optional checkbox, icon, text and trailing icons. Labels and icons are content. Arrow keys move and expand, Enter selects. Iris code: src/iris-shell/src/components/Tree.',
      },
    },
  },
  args: { nodes: NODES, ariaLabel: 'Directory', defaultExpandedIds: ['ad', 'o1d', 'test-ou'] },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Tree" with the first row active. */
export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('ad');
    return <Tree {...args} selectedId={selected} onSelect={setSelected} />;
  },
};

/** UI Kit leading icons "Checkbox=ON". */
export const WithCheckboxes: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<ReadonlySet<string>>(new Set(['keys']));
    return (
      <Tree
        {...args}
        checkedIds={checked}
        onCheckedChange={(id, on) =>
          setChecked((prev) => {
            const next = new Set(prev);
            if (on) next.add(id);
            else next.delete(id);
            return next;
          })
        }
      />
    );
  },
};
