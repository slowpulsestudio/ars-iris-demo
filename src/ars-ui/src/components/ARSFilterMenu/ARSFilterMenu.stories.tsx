import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSFilterMenu } from './ARSFilterMenu.js';

const meta = {
  title: 'ARS/ARS_Filter_Menu',
  component: ARSFilterMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Filter_Menu · ARS - Primary · 3064:26920. Opens from the Filters button in ARS_Table_Toolbar. Shown in the Iris menu (Iris UI Kit \"Menu\").",
      },
    },
  },
} satisfies Meta<typeof ARSFilterMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={300}>
      {(state) => <ARSFilterMenu {...args} {...state} align="start" trigger={iconTrigger('FunnelSimple', 'Filters')} />}
    </MenuPreview>
  ),
};
