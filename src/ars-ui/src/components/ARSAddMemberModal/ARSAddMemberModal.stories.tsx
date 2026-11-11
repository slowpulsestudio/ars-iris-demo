import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSAddMemberModal } from './ARSAddMemberModal.js';

const rows = [
  { id: '1', name: 'jsmith', objectType: 'User', description: 'Senior network administrator in the IT Operations department.' },
  { id: '2', name: 'VPN-Gateway-01', objectType: 'Computer', description: 'Primary VPN gateway server for remote access connections.' },
  { id: '3', name: 'IT-Helpdesk', objectType: 'Group', description: 'Security group for helpdesk staff with tier-1 support permissions.' },
  { id: '4', name: 'svc-backup', objectType: 'Service Account', description: 'Managed service account for automated backup operations.' },
];

const meta = {
  title: 'ARS/Missing from Figma/Add Member modal',
  component: ARSAddMemberModal,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: Modal · ARS_WebUI2_Groups · 215:7485. Title "Add Member" with "Object found: N", a search, a table of objects with checkboxes, paging, the Selected objects block and Cancel and Save.',
      },
    },
  },
  args: {
    found: 42,
    rows,
    selectedIds: ['4'],
    selectedItems: [{ id: '4', label: 'svc-backup' }],
    pagination: { page: 1, pageCount: 5, pageSize: 10 },
  },
} satisfies Meta<typeof ARSAddMemberModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NothingSelected: Story = { args: { selectedIds: [], selectedItems: [] } };
