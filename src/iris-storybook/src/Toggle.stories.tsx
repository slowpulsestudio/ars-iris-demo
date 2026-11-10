import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@iris/components/Toggle/Toggle.js';

const meta = {
  title: 'Iris/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: 'On/off switch (Iris UI Kit "Toggle"). Iris code: src/iris-shell/src/components/Toggle.',
      },
    },
  },
  args: { checked: false, ariaLabel: 'Toggle' },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** UI Kit "Type=Off" and "Type=On", interactive. */
export const Default: Story = {
  render: (args) => {
    const [on, setOn] = useState(args.checked);
    return <Toggle {...args} checked={on} onChange={setOn} />;
  },
};

/** UI Kit "Type=On". */
export const On: Story = { args: { checked: true } };

/** UI Kit "Is Disabled=True", off and on. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Toggle checked={false} disabled ariaLabel="Off, disabled" />
      <Toggle checked disabled ariaLabel="On, disabled" />
    </div>
  ),
};

/** With a visible label. */
export const WithLabel: Story = {
  name: 'With label',
  render: () => {
    const [on, setOn] = useState(false);
    return <Toggle checked={on} onChange={setOn} label="Show selected" />;
  },
};
