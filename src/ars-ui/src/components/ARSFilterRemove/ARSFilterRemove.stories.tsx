import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFilterRemove } from './ARSFilterRemove.js';

const meta = {
  title: 'ARS/ARS_filter-remove',
  component: ARSFilterRemove,
  parameters: {
    docs: { description: { component: 'Figma: ARS_filter-remove · ARS - Primary · 2650:24557' } },
  },
} satisfies Meta<typeof ARSFilterRemove>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (2650:24558). */
export const Default: Story = {};

/** Figma "State=Hover" (2650:24560): the × turns link-hover blue. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
