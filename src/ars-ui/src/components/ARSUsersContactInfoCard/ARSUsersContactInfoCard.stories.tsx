import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUsersContactInfoCard } from './ARSUsersContactInfoCard.js';

const meta = {
  title: 'ARS/ARS_Users_ContactInfo Card',
  component: ARSUsersContactInfoCard,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Users_ContactInfo Card · ARS - Primary · 2820:30082. Figma's edit variant shows the job information fields (office: Budapest), so this does too.",
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Default', 'Variant2'] } },
  decorators: [(Story) => <div style={{ maxWidth: 977 }}><Story /></div>],
} satisfies Meta<typeof ARSUsersContactInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (2820:30083): read mode. */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Variant2" (2820:30142): edit mode. */
export const Variant2: Story = { args: { variant: 'Variant2' } };
