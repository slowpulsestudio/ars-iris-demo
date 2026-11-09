import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTableHeader } from './ARSTableHeader.js';

const meta = {
  title: 'ARS/ARS_Table_Header',
  component: ARSTableHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Table_Header · ARS - Primary · 3368:12193. Figma colours the title #141116 without a variable; this uses the Iris primary text colour so it works in every theme.',
      },
    },
  },
} satisfies Meta<typeof ARSTableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma variant "Vartiant=Default" (82:28896). */
export const Default: Story = { args: { title: 'Test OU' } };
