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

// Figma's Memberships rows (ARS_WebUI2_Groups 167:8089). Figma types the people "0365Group"; here they are Users.
const MEMBERSHIP_ROWS: ARSGroupTableRow[] = [
  ['Management', 'Group', 'This group focuses on managing and enhancing the security and compliance of our enterprise platforms, ensuring that all initiatives align with industry standards and best practices.', 'b8a82c65-8f0a-5g8b-c6kb0-2c8b2a0abc47e'],
  ['Security Objects', 'Group', 'Ensuring that all initiatives align with industry standards and best practices.', 'c51b34e9-9b74-e4dc-c8k0-504a3b8b1N8c'],
  ['Ava Morgan', 'User', 'Align with industry standards and best practices.', 'd8g94dM7-c4f1-7b7f-b7ab-1d2a34a5b8c'],
  ['Neil Smith', 'User', 'This group focuses on managing and enhancing the security and compliance of our enterprise platforms, ensuring that all initiatives align with industry standards and best practices.', 'e7f82c0e-5d4f-4e2d-a5c7-2d3e45b6c9d'],
  ['Ethan Hayes', 'User', 'This group focuses on managing and enhancing the security and compliance of our enterprise platforms, ensuring that all initiatives align with industry standards and best practices.', 'a7f20fg8-5d4f-5d8a-f7a47c0-1648b7088b'],
  ['Mia Foster', 'User', 'This group focuses on platforms, ensuring that all initiatives align with industry standards and best practices.', 'b8g18h9-7d8-5e7f-8g8b-2758cH808b'],
  ['Lucas Grant', 'User', 'Managing the security and compliance of our enterprise platforms, ensuring that all initiatives align with industry standards and best practices.', 'c9h2i70-b-9e0f-9b8c-3869d1919c'],
].map(([name, objectType, description, objectId]) => ({
  id: objectId,
  name,
  objectType,
  description,
  objectId,
  icon: objectType === 'Group' ? 'UsersThree' : 'User',
}));

/**
 * The Groups file's ARS_Group_Object_Memberships table (ARS_WebUI2_Groups 167:8089): type icons, names in primary
 * text, a wider Object Type, a remove button on each row and the table settings button in the head.
 */
export const Memberships: Story = {
  args: { variant: 'Memberships', rows: MEMBERSHIP_ROWS, ariaLabel: 'Members' },
  render: function Render(args) {
    const [rows, setRows] = useState(args.rows);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <ARSGroupTable
        {...args}
        rows={rows}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onRemove={(row) => setRows((current) => current.filter((r) => r.id !== row.id))}
      />
    );
  },
};
