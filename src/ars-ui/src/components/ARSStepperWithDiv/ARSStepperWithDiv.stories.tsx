import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSStepperWithDiv } from './ARSStepperWithDiv.js';

const meta = {
  title: 'ARS/ARS_Stepper_with_div',
  component: ARSStepperWithDiv,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Stepper_with_div · ARS - Primary · 3367:11939, laid out as ARS_WebUI2_CRUD 3663:22067: a top line across the content, then a 40px block with the Iris Stepper in the 702px form column (the steps share it equally), and a 380px fading divider at the column\'s right edge. The current step\'s line is the brand blue (3663:22536); the other steps use the Iris UI Kit .stepper-step variants (8708:2639).',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 1154, height: 400 }}><Story /></div>],
} satisfies Meta<typeof ARSStepperWithDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
