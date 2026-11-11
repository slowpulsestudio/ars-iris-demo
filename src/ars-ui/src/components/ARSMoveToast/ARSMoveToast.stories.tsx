import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSMoveToast } from './ARSMoveToast.js';

const meta = {
  title: 'ARS/Missing from Figma/Move User toast',
  component: ARSMoveToast,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: Move User toast · ARS_WebUI2_Move_Browse_Objects · 2396:13581 (one object, Undo and View object); Toast 2355:28099 (several objects, Undo and View, which goes to the destination folder); Successfully moved toast 2381:23258 (Undo only). Shown at the bottom right of the page.',
      },
    },
  },
  args: {
    message: 'User Evelyn Park moved to Test1 successfully.',
    onUndo: () => {},
    onDismiss: () => {},
    durationMs: 600000,
  },
} satisfies Meta<typeof ARSMoveToast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 2381:23259: Undo only. */
export const UndoOnly: Story = {};

/** Figma 2396:13581: Undo and View object. */
export const OneObject: Story = { args: { onView: () => {}, viewLabel: 'View object' } };

/** Figma 2355:28099: Undo and View, which goes to the destination folder. */
export const SeveralObjects: Story = {
  args: { message: 'Moved 3 objects to Test1 successfully.', onView: () => {} },
};
