import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSSelectedObjectsBlock } from './ARSSelectedObjectsBlock.js';

const meta = {
  title: 'ARS/Missing from Figma/Selected objects block',
  component: ARSSelectedObjectsBlock,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: Selected objects block · ARS_WebUI2_Move_Browse_Objects · 2224:16697. The objects being moved, as Iris Tags that remove one when clicked. Figma draws it 480px wide.',
      },
    },
  },
  args: {
    items: [
      { id: '1', label: 'Clara Webb' },
      { id: '2', label: 'Elena Vasquez' },
      { id: '3', label: 'Peter Kim' },
    ],
    onRemove: () => {},
  },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof ARSSelectedObjectsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
