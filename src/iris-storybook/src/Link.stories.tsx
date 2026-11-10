import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '@iris/components/Link/Link.js';

const meta = {
  title: 'Iris/Link',
  component: Link,
  parameters: {
    docs: { description: { component: 'Inline hyperlink styled with the Iris link colours. Iris code: src/iris-shell/src/components/Link.' } },
  },
  args: { href: '#', children: 'Sofia Nguyen' },
  argTypes: { tone: { control: 'inline-radio', options: ['brand', 'danger'] } },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Danger: Story = { args: { tone: 'danger', children: 'Delete' } };

/** Iris UI Kit sizes: Default (14px) and Large (16px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--oi-spacing-l)' }}>
      <Link {...args} size="default">Default</Link>
      <Link {...args} size="l">Large</Link>
    </div>
  ),
};

/** Iris UI Kit "State=Disabled". */
export const Disabled: Story = { args: { disabled: true } };
