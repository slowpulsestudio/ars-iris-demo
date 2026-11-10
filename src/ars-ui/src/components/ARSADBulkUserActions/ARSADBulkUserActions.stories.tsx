import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSADBulkUserActions } from './ARSADBulkUserActions.js';

const meta = {
  title: 'ARS/ARS_AD Bulk User Actions',
  component: ARSADBulkUserActions,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_AD Bulk User Actions · ARS - Primary · 2385:57425. Shown in the Iris menu, so rows and icons use the Iris menu's sizes. The Move icon (Editing/FolderArrowRight) isn't in the Iris code icon set yet, so it's drawn from Figma.",
      },
    },
  },
} satisfies Meta<typeof ARSADBulkUserActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={240}>
      {(state) => (
        <ARSADBulkUserActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More bulk actions')} />
      )}
    </MenuPreview>
  ),
};
