import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSDeprovisionGroup } from './ARSDeprovisionGroup.js';

const meta = {
  title: 'ARS/Missing from Figma/Deprovision AD Group',
  component: ARSDeprovisionGroup,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: no frame, only the written requirement. Figma: Deprovision AD Group · ARS_WebUI2_Groups · 64:6805 ("confirmation dialogue Yes/No Button, confirmation toast [Undo/Confirm]"). The question text is not in Figma.',
      },
    },
  },
  args: { name: 'Security Users' },
} satisfies Meta<typeof ARSDeprovisionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
