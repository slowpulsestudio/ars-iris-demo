import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSGroupMembershipButtonSelect, type ARSGroupMembershipView } from './ARSGroupMembershipButtonSelect.js';

function Demo({ value: initial }: { value: ARSGroupMembershipView }) {
  const [value, setValue] = useState(initial);
  return <ARSGroupMembershipButtonSelect value={value} onChange={setValue} />;
}

const meta = {
  title: 'ARS/Missing from Figma/ARS_Group_Membership_Button_Select',
  component: ARSGroupMembershipButtonSelect,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Group_Membership_Button_Select · ARS_WebUI2_Groups · 160:9082. A primary button for the chosen view and a secondary one for the other: Members and Members of.',
      },
    },
  },
  args: { value: 'Members' },
  render: (args) => <Demo key={args.value} value={args.value} />,
} satisfies Meta<typeof ARSGroupMembershipButtonSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Members: Story = {};

export const MembersOf: Story = { args: { value: 'Members of' } };
