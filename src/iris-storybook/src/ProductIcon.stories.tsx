import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductIcon, type ProductIconName } from '@iris/components/ProductIcon/ProductIcon.js';

const PRODUCTS: { name: ProductIconName; label: string }[] = [
  { name: 'active-roles', label: 'Active Roles' },
  { name: 'identity-manager', label: 'Identity Manager' },
  { name: 'safeguard', label: 'Safeguard' },
  { name: 'services', label: 'On Demand Services' },
];

const meta = {
  title: 'Iris/ProductIcon',
  component: ProductIcon,
  parameters: {
    docs: { description: { component: 'Product glyph for the product chooser that takes its colour from the surrounding text. Iris code: src/iris-shell/src/components/ProductIcon.' } },
  },
  args: { name: 'active-roles' },
  argTypes: { name: { control: 'inline-radio', options: PRODUCTS.map((product) => product.name) } },
} satisfies Meta<typeof ProductIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Products: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-s)' }}>
      {PRODUCTS.map((product) => (
        <span key={product.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
          <ProductIcon {...args} name={product.name} />
          {product.label}
        </span>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--oi-spacing-s)' }}>
      <ProductIcon {...args} size={16} />
      <ProductIcon {...args} size={20} />
    </div>
  ),
};
