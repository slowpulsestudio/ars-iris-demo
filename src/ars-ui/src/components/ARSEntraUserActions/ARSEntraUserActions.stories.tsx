import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSEntraUserActions } from './ARSEntraUserActions.js';

const meta = {
  title: 'ARS/ARS_Entra User Actions',
  component: ARSEntraUserActions,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Entra User Actions · ARS - Primary · 2275:90868. Shown in the Iris menu, so rows and icons use the Iris menu's sizes.",
      },
    },
  },
} satisfies Meta<typeof ARSEntraUserActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={260}>
      {(state) => (
        <ARSEntraUserActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More actions for Sofia Nguyen')} />
      )}
    </MenuPreview>
  ),
};
