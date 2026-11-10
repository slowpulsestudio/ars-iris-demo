import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSMainContentPlaceholder } from './ARSMainContentPlaceholder.js';

const meta = {
  title: 'ARS/ARS_Main_Content Placeholder',
  component: ARSMainContentPlaceholder,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Main_Content Placeholder · ARS - Primary · 3429:18447. It stretches to fill the space it is placed in, as it fills the content area in ARS_App_Layout_Flat_View, so this story shows it at Figma\'s size, 1238 × 922.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1238, height: 922 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ARSMainContentPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
