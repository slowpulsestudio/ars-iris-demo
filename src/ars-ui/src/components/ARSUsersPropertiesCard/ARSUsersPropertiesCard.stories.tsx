import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSUsersPropertiesCard } from './ARSUsersPropertiesCard.js';

const meta = {
  title: 'ARS/ARS_users_Properties Card',
  component: ARSUsersPropertiesCard,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_users_Properties Card · ARS - Primary · 2820:29757. Figma's read mode says \"User principle name\" and its edit mode \"User principal name\"; both are kept as drawn.",
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Default', 'Variant2'] } },
  decorators: [(Story) => <div style={{ maxWidth: 977 }}><Story /></div>],
} satisfies Meta<typeof ARSUsersPropertiesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (2820:29758): read mode. */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Variant2" (2820:29794): edit mode. */
export const Variant2: Story = { args: { variant: 'Variant2' } };
