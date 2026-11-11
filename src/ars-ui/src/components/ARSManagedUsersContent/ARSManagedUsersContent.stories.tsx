import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSManagedUsersContent } from './ARSManagedUsersContent.js';

const rows = [
  { id: '1', name: 'Global Security', modified: '10/24/23', description: 'Centralized security policies and access controls.', type: 'Managed Unit' },
  { id: '2', name: 'Engineering', modified: '10/22/23', description: 'Platform infrastructure and backend services.', type: 'Managed Unit' },
  { id: '3', name: 'HR Operations', modified: '10/18/23', description: 'Employee onboarding and benefits management.', type: 'Managed Unit' },
  { id: '4', name: 'Finance Admin', modified: '10/15/23', description: 'Financial reporting and budget approvals.', type: 'Managed Unit' },
];

const meta = {
  title: 'ARS/Missing from Figma/ARS_Managed_Users_Content',
  component: ARSManagedUsersContent,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Managed_Users_Content · ARS_WebUI2_Managed-Units · 7058:6179. The Managed Units list: header, search, and a Name, Modified, Description and Type table with paging. Rows are the Figma sample.',
      },
    },
  },
  args: {
    header: { title: 'Managed Units', icon: 'FolderStar' },
    toolbar: { variant: 'Basic', actionLabel: 'Create' },
    rows,
    pagination: { page: 1, pageCount: 3, pageSize: 15 },
  },
} satisfies Meta<typeof ARSManagedUsersContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
