import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSNewObjectToast } from './ARSNewObjectToast.js';

const meta = {
  title: 'ARS/ARS_New_Object_Toast',
  component: ARSNewObjectToast,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_New_Object_Toast · ARS - Primary · 4029:38684. The Iris Toast (success) with a secondary View and a ghost Dismiss. It appears at the bottom right of the page.',
      },
    },
  },
  args: {
    message: '[Object name] successfully created',
    supportingText: '[Object type] created in [Object location] To open it, click View.',
    onDismiss: () => {},
    durationMs: 600000,
  },
} satisfies Meta<typeof ARSNewObjectToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
