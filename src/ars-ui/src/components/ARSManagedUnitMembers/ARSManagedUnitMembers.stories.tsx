import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSManagedUnitMembers } from './ARSManagedUnitMembers.js';

const rows = [
  { id: '1', name: 'Sophia Reyes', description: 'Senior Platform Engineer', type: 'User' },
  { id: '2', name: 'Nadia Patel', description: 'Product Designer', type: 'User' },
  { id: '3', name: 'Engineering Team', description: 'Platform and backend services team', type: 'Group' },
];

const meta = {
  title: 'ARS/Missing from Figma/ARS_Managed_Unit_Members',
  component: ARSManagedUnitMembers,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Managed_Unit_Members · ARS_WebUI2_Managed-Units · 7074:6939 (table 7064:12185). A managed unit\'s members: "[Managed Unit Name] Members", the directory and location, a search and a Name, Description and Type table. Rows are the Figma sample.',
      },
    },
  },
  args: {
    unitName: 'Global Security',
    directory: 'O1D.local',
    location: 'Managed Units',
    rows,
    pagination: { page: 1, pageCount: 3, pageSize: 15 },
  },
} satisfies Meta<typeof ARSManagedUnitMembers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
