import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSRenameGroup } from './ARSRenameGroup.js';

const meta = {
  title: 'ARS/Missing from Figma/Rename Group Modal',
  component: ARSRenameGroup,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: no frame, only the written requirement. Figma: Rename Group Modal · ARS_WebUI2_Groups · 64:6802 ("Name [Input field], Group name (Pre-windows 2000) [Input field]"). Built on the ARS modal panel; the button labels Cancel and Rename are not in Figma.',
      },
    },
  },
  args: { name: 'Security Users', groupName: 'Security Users' },
} satisfies Meta<typeof ARSRenameGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrors: Story = {
  args: { name: '', nameError: 'Name is required.', groupName: '', groupNameError: 'Group name (Pre-Windows 2000) is required.' },
};
