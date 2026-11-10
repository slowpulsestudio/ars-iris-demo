import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSSubTabsTemplate } from './ARSSubTabsTemplate.js';

const meta = {
  title: 'ARS/ARS_Sub_Tabs_Template',
  component: ARSSubTabsTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Figma: ARS_Sub_Tabs_Template · ARS - Primary · 4503:19905. Figma builds it from ARS_Group_Header and ARS_Group_Tabs, which come from outside this file; here they are the kit's shared page header and tabs. The sub-tabs follow Figma's segmented control, which the Iris code doesn't have.",
      },
    },
  },
  decorators: [(Story) => <div style={{ height: 640 }}><Story /></div>],
} satisfies Meta<typeof ARSSubTabsTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
