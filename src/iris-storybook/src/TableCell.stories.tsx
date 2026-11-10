import type { Meta, StoryObj } from '@storybook/react-vite';
import { CellText, TableCell } from '@iris/components/TableCell/TableCell.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';

const meta = {
  title: 'Iris/TableCell',
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component:
          'One cell of a table row (Iris UI Kit ".Cell item", Component / Table). Iris code: src/iris-shell/src/components/TableCell.',
      },
    },
  },
  decorators: [(Story) => <div style={{ display: 'flex', width: 220 }}><Story /></div>],
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Type=Heading". */
export const Heading: Story = {
  args: { style: { width: 220 }, children: <CellText>Cell content</CellText> },
};

/** UI Kit "Type=Checkbox" (8px inset). */
export const WithCheckbox: Story = {
  name: 'Checkbox',
  args: { inset: 's', children: <Checkbox ariaLabel="Select row" /> },
};

/** UI Kit "Type=Icon button ghost" (6px inset). */
export const WithIconButton: Story = {
  name: 'Icon button ghost',
  args: { inset: 'button', divider: false, children: <IconButton icon="DotsThree" ariaLabel="Row actions" /> },
};
