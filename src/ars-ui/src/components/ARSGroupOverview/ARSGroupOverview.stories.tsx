import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSGroupOverview } from './ARSGroupOverview.js';

const meta = {
  title: 'ARS/Missing from Figma/ARS_Group_Overview',
  component: ARSGroupOverview,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Group_Overview · ARS_WebUI2_Groups · 158:33654 (in ARS_Group_Page_Overview 158:36016). "Overview" with a subtitle, then Basic information and Members as labelled rows; the member counts are links.',
      },
    },
  },
  args: {
    name: 'Security Users',
    membershipType: 'Security Group',
    source: 'Cloud',
    objectId: 'b8a5d3e9-7f2c-4b1a-9e6d-3c8f20a1b4c7',
    createdOn: 'Jan 12, 2024',
    email: 'security.users@contoso.com',
    counts: { total: 47, users: 32, groups: 8, devices: 5, others: 2, owners: 3 },
    onCopyName: () => {},
    onOpenMembers: () => {},
  },
} satisfies Meta<typeof ARSGroupOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Deprovisioned: Story = { args: { badges: [{ label: 'Deprovisioned', tone: 'warning' }] } };
