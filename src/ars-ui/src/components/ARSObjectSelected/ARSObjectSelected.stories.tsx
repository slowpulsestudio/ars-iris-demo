import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSObjectSelected } from './ARSObjectSelected.js';

const meta = {
  title: 'ARS/ARS_object-selected',
  component: ARSObjectSelected,
  parameters: {
    docs: { description: { component: 'Figma: ARS_object-selected · ARS - Primary · 2650:24543' } },
  },
} satisfies Meta<typeof ARSObjectSelected>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (2650:24544). */
export const Default: Story = {};

/** Figma "State=Hover" (2650:24547): icon and text turn link-hover blue. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
