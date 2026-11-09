import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo } from '@iris/components/BrandLogo/BrandLogo.js';

const meta = {
  title: 'Iris/BrandLogo',
  component: BrandLogo,
  parameters: {
    docs: { description: { component: 'Product logomark that keeps its own brand colour in every theme; use it instead of Icon wherever the product mark appears. Iris code: src/iris-shell/src/components/BrandLogo.' } },
  },
  args: { title: 'Active Roles' },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <BrandLogo {...args} size="24px" />
      <BrandLogo {...args} size="32px" />
    </div>
  ),
};

export const WithProductName: Story = {
  name: 'With product name',
  args: { title: undefined },
  render: (args) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <BrandLogo {...args} />
      Active Roles
    </span>
  ),
};
