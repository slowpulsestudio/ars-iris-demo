import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSNewOrganizationalUnit } from './ARSNewOrganizationalUnit.js';

const meta = {
  title: 'ARS/Missing from Figma/ARS_New_Organizational_Unit',
  component: ARSNewOrganizationalUnit,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_New_Organizational_Unit · ARS_WebUI2_OU_Management · 1394:14812. Name, Description and the protect checkbox beside an explanation, with the step footer reading "Save & Continue →". Figma draws the header icon as People/User. The "Open properties" checkbox is from the written requirement 1091:6250, not the frame.',
      },
    },
  },
  args: { values: { name: 'My OU', description: '', protect: false, openProperties: false } },
} satisfies Meta<typeof ARSNewOrganizationalUnit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NameMissing: Story = {
  args: { values: { name: '', description: '', protect: false, openProperties: false }, nameError: 'Name is required.' },
};
