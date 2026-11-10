import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '@iris/components/Tag/Tag.js';

const meta = {
  title: 'Iris/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: 'Icon on the left, text on the right (Iris UI Kit "Tag"). Iris code: src/iris-shell/src/components/Tag.',
      },
    },
  },
  args: { label: 'Tag' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "State=Default". */
export const Default: Story = {};

/** Removable: the × half is a button (UI Kit "Hover" and "Focus Action" states). */
export const Removable: Story = { args: { onAction: () => {}, actionLabel: 'Remove Tag' } };
