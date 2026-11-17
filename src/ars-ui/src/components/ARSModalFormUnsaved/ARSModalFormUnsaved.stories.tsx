import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSModalFormUnsaved } from './ARSModalFormUnsaved.js';

const meta = {
  title: 'ARS/Missing from Figma/ARS_Modal_Form_Unsaved',
  component: ARSModalFormUnsaved,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Modal_Form_Unsaved · ARS_WebUI2_CRUD · 3534:19369, with ARS_Modal_Form_Unsaved_Content (3534:19266). The text is Figma\'s, including "discard".',
      },
    },
  },
} satisfies Meta<typeof ARSModalFormUnsaved>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Not in Figma: the destructive version on the New object form (decided UI rule MOD-2), a ghost Cancel and a danger
 * "Discard changes". Figma draws, and the object pages' edit mode keep, a secondary Cancel and a primary Confirm.
 */
export const Destructive: Story = { args: { destructive: true } };
