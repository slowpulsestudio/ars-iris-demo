import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview } from '../../stories/MenuPreview.js';
import { ARSCreateMenuButton } from './ARSCreateMenuButton.js';

const meta = {
  title: 'ARS/ARS_Create_Menu_Button',
  component: ARSCreateMenuButton,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Create_Menu_Button · ARS - Primary · 3360:40921. Built on the Iris SplitButton; its Hover and Active states are the Iris button\'s own hover and pressed styles, so hover or press it to see them. The arrow opens the Create menu.',
      },
    },
  },
} satisfies Meta<typeof ARSCreateMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (3360:40922). */
export const Default: Story = {};

/** Figma "OU_Create_menu_button" (3360:40934): the button with the Create menu open. */
export const MenuOpen: Story = {
  name: 'Menu open',
  render: (args) => <MenuPreview height={380}>{(state) => <ARSCreateMenuButton {...args} {...state} />}</MenuPreview>,
};
