import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSCreateMenu } from './ARSCreateMenu.js';

const meta = {
  title: 'ARS/Create menu',
  component: ARSCreateMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: Create menu · ARS - Primary · 3360:40902. Opens from ARS_Create_Menu_Button. Shown in the Iris menu, so rows and icons use the Iris menu's sizes; the Iris menu is at most 240px wide, so \"Group Managed Service Account\" may be cut short (Figma's menu is 286px).",
      },
    },
  },
} satisfies Meta<typeof ARSCreateMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={360}>
      {(state) => <ARSCreateMenu {...args} {...state} align="start" trigger={iconTrigger('Plus', 'Create')} />}
    </MenuPreview>
  ),
};
