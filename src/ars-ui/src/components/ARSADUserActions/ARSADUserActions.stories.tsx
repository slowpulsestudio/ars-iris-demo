import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSADUserActions } from './ARSADUserActions.js';

const meta = {
  title: 'ARS/ARS_AD User Actions',
  component: ARSADUserActions,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_AD User Actions · ARS - Primary · 2275:90709. Shown in the Iris menu, so rows and icons use the Iris menu's sizes.",
      },
    },
  },
} satisfies Meta<typeof ARSADUserActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MenuPreview height={500}>
      {(state) => (
        <ARSADUserActions {...args} {...state} align="start" trigger={iconTrigger('DotsThree', 'More actions for Sofia Nguyen')} />
      )}
    </MenuPreview>
  ),
};
