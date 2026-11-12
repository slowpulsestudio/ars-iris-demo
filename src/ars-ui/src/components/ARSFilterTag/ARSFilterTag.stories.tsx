import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFilterTag } from './ARSFilterTag.js';

const meta = {
  title: 'ARS/Missing from Figma/ARS_Filter_Tag',
  component: ARSFilterTag,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Filter_Tag · ARS_WebUI2_Advanced-Search · 2099:18646 (used at 4145:13715). A filter pill: field, rule, values with a count badge, then the ×.',
      },
    },
  },
  args: { field: 'Object type', rule: 'is', values: ['Computer', 'Group', 'User', 'Contact', 'Printer'] },
} satisfies Meta<typeof ARSFilterTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: "Object type is Computer, Group +3 ×" (4145:13715). */
export const WithCount: Story = {};

/** Two or fewer values: no badge. */
export const NoCount: Story = { args: { values: ['Computer', 'Group'] } };

/** Pressing the pill edits it. */
export const Editable: Story = { args: { onEdit: () => {} } };
