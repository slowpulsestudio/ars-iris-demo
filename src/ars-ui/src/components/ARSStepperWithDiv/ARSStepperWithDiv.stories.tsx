import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSStepperWithDiv } from './ARSStepperWithDiv.js';

const meta = {
  title: 'ARS/ARS_Stepper_with_div',
  component: ARSStepperWithDiv,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Stepper_with_div · ARS - Primary · 3367:11939. The Iris Stepper, plus a 380px vertical divider that fades out below the row (it sits beside the new-object form).',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 1154, height: 400 }}><Story /></div>],
} satisfies Meta<typeof ARSStepperWithDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
