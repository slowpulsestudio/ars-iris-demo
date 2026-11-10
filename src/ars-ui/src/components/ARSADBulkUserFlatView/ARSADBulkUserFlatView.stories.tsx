import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSADBulkUserFlatView } from './ARSADBulkUserFlatView.js';

const meta = {
  title: 'ARS/ARS_AD Bulk User Flat View',
  component: ARSADBulkUserFlatView,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_AD Bulk User Flat View · ARS - Primary · 2385:57426. Shown in the Iris menu (Iris UI Kit \"Menu\"). The last two rows are the Iris menu's placeholder \"Menu item\" rows, as Figma has them.",
      },
    },
  },
} satisfies Meta<typeof ARSADBulkUserFlatView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={220}>
      {(state) => (
        <ARSADBulkUserFlatView {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More bulk actions')} />
      )}
    </MenuPreview>
  ),
};
