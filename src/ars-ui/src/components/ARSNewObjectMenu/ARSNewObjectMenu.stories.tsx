import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSNewObjectMenu } from './ARSNewObjectMenu.js';

const meta = {
  title: 'ARS/ARS_New Object Menu',
  component: ARSNewObjectMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_New Object Menu · ARS - Primary · 3066:57117 (labelled \"New object from Tree View OU/Folder AD\"). Shown in the Iris menu, so rows and icons use the Iris menu's sizes. The Iris menu is at most 240px wide, so \"New Group Managed Service Account\" is cut short (Figma's menu is 295px).",
      },
    },
  },
} satisfies Meta<typeof ARSNewObjectMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={460}>
      {(state) => <ARSNewObjectMenu {...args} {...state} align="start" trigger={iconTrigger('Plus', 'New object')} />}
    </MenuPreview>
  ),
};
