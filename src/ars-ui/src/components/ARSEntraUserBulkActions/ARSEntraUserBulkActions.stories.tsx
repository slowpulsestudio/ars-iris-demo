import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSEntraUserBulkActions } from './ARSEntraUserBulkActions.js';

const meta = {
  title: 'ARS/Entra User Bulk Actions',
  component: ARSEntraUserBulkActions,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: Entra User Bulk Actions · ARS - Primary · 2275:91260. Shown in the Iris menu, so rows and icons use the Iris menu's sizes.",
      },
    },
  },
} satisfies Meta<typeof ARSEntraUserBulkActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={200}>
      {(state) => (
        <ARSEntraUserBulkActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More bulk actions')} />
      )}
    </MenuPreview>
  ),
};
