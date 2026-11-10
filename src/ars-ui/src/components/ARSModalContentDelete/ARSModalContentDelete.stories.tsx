import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSModalContentDelete } from './ARSModalContentDelete.js';

const meta = {
  title: 'ARS/ARS_Modal_Content_Delete',
  component: ARSModalContentDelete,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Modal_Content_Delete · ARS - Primary · 3651:44611. The field is a plain copy of a text input in Figma (audit); here it is the Iris TextInput with the ARS grey fill and secondary text. Figma also places EyeSlash and CopySimple icons in the field, outside the visible 380px frame, so they do not show.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 380 }}><Story /></div>],
} satisfies Meta<typeof ARSModalContentDelete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
