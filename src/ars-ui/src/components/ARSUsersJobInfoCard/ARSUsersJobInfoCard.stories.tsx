import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUsersJobInfoCard } from './ARSUsersJobInfoCard.js';

const meta = {
  title: 'ARS/ARS_Users_Job Info Card',
  component: ARSUsersJobInfoCard,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Users_Job Info Card · ARS - Primary · 2820:29901' } },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Default', 'Variant2'] } },
  decorators: [(Story) => <div style={{ maxWidth: 977 }}><Story /></div>],
} satisfies Meta<typeof ARSUsersJobInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (2820:29902): read mode. */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Variant2" (2820:29953): edit mode. */
export const Variant2: Story = { args: { variant: 'Variant2' } };
