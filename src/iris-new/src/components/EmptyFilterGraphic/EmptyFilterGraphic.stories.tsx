import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyFilterGraphic } from './EmptyFilterGraphic.js';

const meta = {
  title: 'Iris new/Advanced filter/Empty filter graphic',
  component: EmptyFilterGraphic,
  parameters: {
    docs: {
      description: {
        component:
          'The drawing in the empty Advanced filter Panel, recoloured with the border tokens so it follows the theme. ' +
          'Figma: Iris UI Kit · .illu (temp) 9896:1571.',
      },
    },
  },
} satisfies Meta<typeof EmptyFilterGraphic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
