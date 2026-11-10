import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSPageMenu } from './ARSPageMenu.js';

const meta = {
  title: 'ARS/ARS_Page Menu',
  component: ARSPageMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Page Menu · ARS - Primary · 3663:20458. Shown in the Iris menu, so rows and icons use the Iris menu's sizes. Figma note on Customize: \"In development feature- Placeholder\".",
      },
    },
  },
} satisfies Meta<typeof ARSPageMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={240}>
      {(state) => <ARSPageMenu {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More actions')} />}
    </MenuPreview>
  ),
};
