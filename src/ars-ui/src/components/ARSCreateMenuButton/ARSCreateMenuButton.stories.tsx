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
          'Figma: ARS_Create_Menu_Button · ARS - Primary · 3360:40921. Built on the Iris SplitButton; Hover and Active are the Iris button\'s own hover and pressed styles. The arrow opens the Create menu.',
      },
    },
  },
} satisfies Meta<typeof ARSCreateMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (3360:40922). */
export const Default: Story = {};

/** Figma "State=Hover" (3360:40926). */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };

/** Figma "State=Active" (3360:40930). */
export const Active: Story = { parameters: { pseudo: { active: true } } };

/** Figma "OU_Create_menu_button" (3360:40934): the button with the Create menu open. */
export const MenuOpen: Story = {
  name: 'Menu open',
  render: (args) => <MenuPreview height={380}>{(state) => <ARSCreateMenuButton {...args} {...state} />}</MenuPreview>,
};
