import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedItem,
} from '@iris/components/SegmentedControl/SegmentedControl.js';

const VIEWS: SegmentedItem[] = [
  { value: 'flat', label: 'Flat view', icon: 'BuildingOffice' },
  { value: 'tree', label: 'Tree view', icon: 'TreeView' },
  { value: 'favourites', label: 'Favourites', icon: 'Heart' },
];

function SegmentedControlDemo(args: SegmentedControlProps) {
  const [value, setValue] = useState(args.value);
  return <SegmentedControl {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Iris/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    docs: { description: { component: 'Single-select option group shown as a row of segments, each with an icon above its label. Iris code: src/iris-shell/src/components/SegmentedControl.' } },
  },
  args: { items: VIEWS, value: 'flat', ariaLabel: 'Directory view' },
  argTypes: { value: { control: 'inline-radio', options: VIEWS.map((item) => item.value) } },
  render: (args) => <SegmentedControlDemo key={args.value} {...args} />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCelebration: Story = {
  name: 'With celebration',
  args: { items: VIEWS.map((item) => (item.value === 'favourites' ? { ...item, celebrate: true } : item)) },
};
