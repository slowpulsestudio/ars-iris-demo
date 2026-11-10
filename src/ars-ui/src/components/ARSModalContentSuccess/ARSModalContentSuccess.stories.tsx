import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSModalContentSuccess } from './ARSModalContentSuccess.js';

const meta = {
  title: 'ARS/ARS_Modal_Content_Success',
  component: ARSModalContentSuccess,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Modal_Content_Success · ARS - Primary · 3651:44368. The password field is a plain copy of a text input in Figma (audit); here it is the Iris TextInput (password) with the ARS grey fill and secondary text. Figma also places EyeSlash and CopySimple icons in the field, outside the visible 380px frame, so they do not show.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 380 }}><Story /></div>],
} satisfies Meta<typeof ARSModalContentSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
