import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSElementDragged } from './ARSElementDragged.js';

const meta = {
  title: 'ARS/Missing from Figma/Element-Dragged',
  component: ARSElementDragged,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: Element-Dragged · ARS_WebUI2_Move_Browse_Objects · 2281:47208 (variants Directory folder 2244:14604, User 2281:47209). The chip that follows the pointer while an object is dragged to a folder in the directory tree.',
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Directory folder', 'User'] } },
  args: { variant: 'Directory folder', label: 'Test1' },
} satisfies Meta<typeof ARSElementDragged>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=Directory folder" (2244:14604). */
export const DirectoryFolder: Story = {};

/** Figma "Variant=User" (2281:47209). */
export const User: Story = { args: { variant: 'User', label: 'Ava Morgan' } };
