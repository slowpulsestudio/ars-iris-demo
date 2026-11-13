import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarHarness } from '../../stories/FilterHarness.js';
import { barFilter, blankFilter } from '../../stories/filterSamples.js';
import { AdvancedFilterBar } from './AdvancedFilterBar.js';

const meta = {
  title: 'Iris new/Advanced filter/Bar',
  component: AdvancedFilterBar,
  parameters: {
    docs: {
      description: {
        component:
          'Advanced filter "Bar": the applied filter as pills under the content header. Used in modals and Favorites; everywhere else uses the Panel. ' +
          'Press the value of a one-condition pill to pick its values and the operator to change it. The field, "and N more conditions" and the grey "Advanced filter" pill open the pill\'s group: conditions as pills, groups as cards, AND/OR chips and "+ Filter". ' +
          'Figma: Iris UI Kit · Pattern / Advanced filter patterns · 9722:13727 (Content header 10012:3544).',
      },
    },
  },
} satisfies Meta<typeof AdvancedFilterBar>;

export default meta;
type Story = StoryObj;

/** Filled, with icons (10012:3544). One pill per rule card; "and 3 more conditions" collapses the rest. */
export const Filled: Story = { render: () => <BarHarness initial={barFilter} /> };

/** Empty state: the grey "Advanced filter" pill (10153:6602). */
export const Empty: Story = { render: () => <BarHarness initial={blankFilter} /> };
