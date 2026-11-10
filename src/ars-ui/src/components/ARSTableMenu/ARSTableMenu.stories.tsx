import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSTableMenu } from './ARSTableMenu.js';

const meta = {
  title: 'ARS/ARS_Table Menu',
  component: ARSTableMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Table Menu · ARS - Primary · 3663:20381. Shown in the Iris menu (Iris UI Kit \"Menu\"). Figma note on Adjust columns: \"These are placeholders until we have fully reviewed AG Grid with Developers\".",
      },
    },
  },
} satisfies Meta<typeof ARSTableMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={240}>
      {(state) => <ARSTableMenu {...args} {...state} align="start" trigger={iconTrigger('SlidersHorizontal', 'Table settings')} />}
    </MenuPreview>
  ),
};
