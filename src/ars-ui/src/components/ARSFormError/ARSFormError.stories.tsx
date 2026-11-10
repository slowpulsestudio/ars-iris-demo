import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFormError } from './ARSFormError.js';

const meta = {
  title: 'ARS/ARS_Form_Error',
  component: ARSFormError,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Form_Error · ARS - Primary · 3621:46744. The Iris Banner (error, coloured) above the properties form; the User logon name field shows the Iris error state and message.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 1154 }}><Story /></div>],
} satisfies Meta<typeof ARSFormError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
