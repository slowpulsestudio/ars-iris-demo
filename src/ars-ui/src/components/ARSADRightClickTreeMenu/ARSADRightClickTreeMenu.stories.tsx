import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenuPreview } from '../../stories/MenuPreview.js';
import { ARSADRightClickTreeMenu } from './ARSADRightClickTreeMenu.js';

const meta = {
  title: 'ARS/ARS_AD Right Click Tree Menu',
  component: ARSADRightClickTreeMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_AD Right Click Tree Menu · ARS - Primary · 2385:57427. Shown in the Iris menu (Iris UI Kit \"Menu\"). Figma draws Create with a submenu arrow; it opens ARS_New Object Menu, the Figma menu labelled \"New object from Tree View OU/Folder AD\". Right-click the folder to move the menu.",
      },
    },
  },
} satisfies Meta<typeof ARSADRightClickTreeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ContextMenuPreview label="Test OU">
      {(state) => <ARSADRightClickTreeMenu {...args} {...state} />}
    </ContextMenuPreview>
  ),
};
