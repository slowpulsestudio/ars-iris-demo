import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableHeadItem } from '@iris/components/TableHeadItem/TableHeadItem.js';

const meta = {
  title: 'Iris/TableHeadItem',
  component: TableHeadItem,
  parameters: {
    docs: {
      description: {
        component:
          'One column heading (Iris UI Kit ".Table head item", Component / Table). Iris code: src/iris-shell/src/components/TableHeadItem.',
      },
    },
  },
  args: { label: 'Cell content', style: { width: 220 } },
} satisfies Meta<typeof TableHeadItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Type=Heading". */
export const Heading: Story = {};

/** UI Kit "Type=Icon + Heading". */
export const IconAndHeading: Story = { name: 'Icon + Heading', args: { icon: 'User' } };

/** UI Kit "Icon RHS". */
export const TrailingIcon: Story = { name: 'Trailing icon', args: { iconTrail: 'CaretDown' } };
