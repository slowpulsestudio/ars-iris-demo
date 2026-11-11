import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableGroups, type ARSTableGroupsRow } from './ARSTableGroups.js';

const ROWS: ARSTableGroupsRow[] = [
  { id: '1', name: 'All Company', groupType: 'O365Group', description: 'This group focuses on managing and enhancing the security of our enterprise platform.', tags: ['Security', 'Compliance'], directory: 'Entra1' },
  { id: '2', name: 'Marketing Team', groupType: 'O365Group', description: 'Ensuring that all initiatives align with industry standards and best practices.', tags: ['Marketing', 'Strategy'], directory: 'Entra1' },
  { id: '3', name: 'Development Crew', groupType: 'O365Group', groupTypeTone: 'error', description: 'This group focuses on managing and enhancing the security and compliance operations.', tags: ['Engineering', 'DevOps'], directory: 'Entra1' },
  { id: '4', name: 'Security Users', groupType: 'SecurityGroup', groupTypeTone: 'warning', description: 'Managing the security and compliance of our enterprise platform infrastructure.', tags: ['Security', 'Administrator'], directory: 'AD1\\Groups' },
  { id: '5', name: 'Executive Staff', groupType: 'SecurityGroup', description: 'Senior leadership group with elevated access to strategic planning resources.', tags: ['Leadership', 'Strategy'], directory: 'AD2\\OU1' },
];

function Demo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState(ROWS);
  return (
    <ARSTableGroups
      header={{ title: "Groups", icon: 'UsersThree' }}
      toolbar={{ variant: 'Basic', actionLabel: 'Create' }}
      rows={rows}
      selected={selected}
      onSelectionChange={setSelected}
      onRemoveTag={(id, tag) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, tags: r.tags.filter((t) => t !== tag) } : r)))}
      pagination={{ page: 1, pageCount: 154, onPageChange: () => {}, pageSize: 15, pageSizeOptions: [15, 30, 50] }}
    />
  );
}

const meta = {
  title: 'ARS/Missing from Figma/ARS_Table_Groups',
  component: Demo,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Table_Groups · ARS_WebUI2_Groups · 158:33464. Name, Group type (badge in the Code style), Description, removable Tags and Directory, with ARS_Pagination. Rows from Figma; the badge colours vary in Figma without a stated meaning.',
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
