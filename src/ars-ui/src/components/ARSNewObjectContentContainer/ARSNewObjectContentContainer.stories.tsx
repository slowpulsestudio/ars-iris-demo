import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSNewObjectContentContainer } from './ARSNewObjectContentContainer.js';

const meta = {
  title: 'ARS/ARS_New_Object_Content_Container',
  component: ARSNewObjectContentContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_New_Object_Content_Container · ARS - Primary · 3367:12347. ARS_Stepper_with_div above the form. As in Figma, the form here is the hidden copy of ARS_New_Object_Content (two equal columns, 280px name fields), not the one on the components page (audit note 1).',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 1154 }}><Story /></div>],
} satisfies Meta<typeof ARSNewObjectContentContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
