import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GROUP_OBJECT_ID, GROUPS } from '../../stories/groupSamples.js';
import { ARSGroupTable, type ARSGroupTableRow } from './ARSGroupTable.js';

// Figma's rows, in its order (Marketing Team appears twice).
const ROWS: ARSGroupTableRow[] = [
  'allCompany',
  'marketingTeam',
  'developmentCrew',
  'securityUsers',
  'marketingTeam',
  'salesDivision',
  'productManagement',
  'humanResources',
].map((key, i) => ({ id: `${key}-${i}`, ...GROUPS[key], objectId: GROUP_OBJECT_ID }));

const meta = {
  title: 'ARS/ARS_Group_Table',
  component: ARSGroupTable,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Group_Table · ARS - Primary · 2843:24904' } },
  },
  args: { rows: ROWS },
  decorators: [(Story) => <div style={{ maxWidth: 1178 }}><Story /></div>],
} satisfies Meta<typeof ARSGroupTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return <ARSGroupTable {...args} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} />;
  },
};
