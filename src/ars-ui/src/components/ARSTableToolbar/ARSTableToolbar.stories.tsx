import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from '@iris/components/SegmentedControl/SegmentedControl.js';
import { ARSTableToolbar } from './ARSTableToolbar.js';

const meta = {
  title: 'ARS/ARS_Table_Toolbar',
  component: ARSTableToolbar,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Table_Toolbar · ARS - Primary · 2613:23294' } },
  },
} satisfies Meta<typeof ARSTableToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Vartiant=Split" (82:28898). */
export const Split: Story = { args: { variant: 'Split' } };

/** Figma "Vartiant=Basic" (2613:23295). */
export const Basic: Story = { args: { variant: 'Basic' } };

/** Figma "Vartiant=No create" (3306:19725). */
export const NoCreate: Story = { name: 'No create', args: { variant: 'No create' } };

/** Figma "Vartiant=4" (4198:23796). */
export const Four: Story = { name: '4', args: { variant: '4' } };

/**
 * The Groups file's Memberships toolbar (ARS_WebUI2_Groups 167:7970): the view switch and a divider before the
 * search, which fills the row, no filter button, and a primary "Add members" (Figma writes "Add member").
 */
export const Memberships: Story = {
  args: { variant: 'Basic', hideFilter: true, actionLabel: 'Add members', searchPlaceholder: 'Search all members of ...' },
  render: function Render(args) {
    const [view, setView] = useState('members');
    return (
      <ARSTableToolbar
        {...args}
        leading={
          <SegmentedControl
            layout="inline"
            ariaLabel="Memberships view"
            value={view}
            onChange={setView}
            items={[
              { value: 'all', label: 'All', icon: 'UsersFour' },
              { value: 'members', label: 'Members', icon: 'Users' },
              { value: 'members-of', label: 'Members Of', icon: 'UserGear' },
            ]}
          />
        }
      />
    );
  },
};
