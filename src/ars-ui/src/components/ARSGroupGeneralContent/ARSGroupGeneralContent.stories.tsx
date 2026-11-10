import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSGroupGeneralContent } from './ARSGroupGeneralContent.js';

const meta = {
  title: 'ARS/ARS_Group_General content',
  component: ARSGroupGeneralContent,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Group_General content · ARS - Primary · 2944:30704. Variant2 is the read card when hovered: hovering the Default story shows the same.',
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Default', 'Variant2', 'Variant3'] } },
  decorators: [(Story) => <div style={{ maxWidth: 977 }}><Story /></div>],
} satisfies Meta<typeof ARSGroupGeneralContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (2944:30705): read mode. */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Variant2" (2944:30742): read mode, hovered. */
export const Variant2: Story = { args: { variant: 'Variant2' } };

/** Figma "Property 1=Variant3" (2944:30780): edit mode. */
export const Variant3: Story = { args: { variant: 'Variant3' } };
