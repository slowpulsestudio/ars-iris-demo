import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSNewObjectTemplate } from './ARSNewObjectTemplate.js';

const meta = {
  title: 'ARS/ARS_New_Object_Template',
  component: ARSNewObjectTemplate,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Figma: ARS_New_Object_Template · ARS - Primary · 3367:12947. Header, ARS_New_Object_Content_Container (with ARS_New_Object_Content and its folder button) and ARS_.Modal_New_Object_Footer. Figma links it to NewUserModal.tsx, which is not in this project (audit note 5). Figma annotation: the step count hides when the action has no steps (hasSteps).',
      },
    },
  },
} satisfies Meta<typeof ARSNewObjectTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Figma annotation: no steps, so no step count. */
export const NoSteps: Story = { name: 'No steps', args: { hasSteps: false } };
