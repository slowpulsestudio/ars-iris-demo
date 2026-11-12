import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelInlineActions } from './PanelInlineActions.js';

const meta = {
  title: 'Iris new/Advanced filter/Panel inline actions',
  component: PanelInlineActions,
  parameters: {
    docs: { description: { component: 'Figma: Iris UI Kit · .Panel, inline actions group · 10233:5581' } },
  },
  args: { onAddCondition: () => {}, onAddGroup: () => {} },
} satisfies Meta<typeof PanelInlineActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** At the nesting limit only "+New condition" remains. */
export const ConditionOnly: Story = { args: { onAddGroup: undefined } };
