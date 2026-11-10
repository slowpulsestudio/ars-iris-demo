import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSObjectRule } from './ARSObjectRule.js';

const meta = {
  title: 'ARS/ARS_object-rule',
  component: ARSObjectRule,
  parameters: {
    docs: { description: { component: 'Figma: ARS_object-rule · ARS - Primary · 2650:24550' } },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Default', 'text'] } },
} satisfies Meta<typeof ARSObjectRule>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (2650:24551). */
export const Default: Story = {};

/** Figma "State=text" (2650:24553). */
export const Text: Story = { name: 'text', args: { variant: 'text' } };

/** Figma "State=Hover" (2650:24555): the chip darkens to the secondary button hover colour. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
