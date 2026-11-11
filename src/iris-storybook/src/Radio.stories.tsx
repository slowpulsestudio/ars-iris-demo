import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, type RadioProps } from '@iris/components/Radio/Radio.js';

function RadioDemo(args: RadioProps) {
  const [value, setValue] = useState(args.value);
  return <Radio {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Iris/Radio',
  component: Radio,
  parameters: {
    docs: { description: { component: 'A group of radio buttons where one option is chosen. Iris code: src/iris-shell/src/components/Radio.' } },
  },
  args: { label: 'Group scope', options: ['Domain local', 'Global', 'Universal'], value: 'Global', onChange: () => {} },
  render: (args) => <RadioDemo key={args.value} {...args} />,
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoOptions: Story = {
  name: 'Two options',
  args: { label: 'Group type', options: ['Security', 'Distribution'], value: 'Security' },
};
