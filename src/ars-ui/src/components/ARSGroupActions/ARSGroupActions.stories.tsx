import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSGroupActions } from './ARSGroupActions.js';

const meta = {
  title: 'ARS/Missing from Figma/Object Actions',
  component: ARSGroupActions,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: no menu is drawn, only written requirements. Figma: "Object Actions" · ARS_WebUI2_Groups · 64:6801, and the ARS 9.0 WebUI requirements board: AD group 453:2930 (Properties, Rename, Move, Copy, Deprovision, Delete) and Entra group 531:1408 (the same without Move). Opened from a row\'s "…" in the Groups list, in the Iris menu with the AD user menu\'s icons.',
      },
    },
  },
} satisfies Meta<typeof ARSGroupActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'AD group',
  render: (args) => (
    <MenuPreview height={320}>
      {(state) => (
        <ARSGroupActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More actions for Security Users')} />
      )}
    </MenuPreview>
  ),
};

/** Entra groups have no Move (requirements board 531:1408). */
export const Entra: Story = {
  name: 'Entra group',
  args: { entra: true },
  render: (args) => (
    <MenuPreview height={300}>
      {(state) => (
        <ARSGroupActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More actions for Network Auditors')} />
      )}
    </MenuPreview>
  ),
};
