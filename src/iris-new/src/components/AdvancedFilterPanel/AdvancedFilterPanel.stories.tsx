import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelHarness } from '../../stories/FilterHarness.js';
import { blankFilter, nestedFilter, orFilter, singleCardFilter } from '../../stories/filterSamples.js';
import { AdvancedFilterPanel } from './AdvancedFilterPanel.js';

const meta = {
  title: 'Iris new/Advanced filter/Panel',
  component: AdvancedFilterPanel,
  parameters: {
    docs: {
      description: {
        component:
          'Advanced filter "Panel" (side sheet): used everywhere except modals and Favorites, which use the Bar. ' +
          'Figma: Iris UI Kit · Pattern / Advanced filter patterns · 9956:7605 (panel, min-width 9722:12155, max-width 9713:9223).',
      },
    },
  },
} satisfies Meta<typeof AdvancedFilterPanel>;

export default meta;
type Story = StoryObj;
const render = (initial: () => ReturnType<typeof blankFilter>, width?: number, view?: 'builder' | 'query') => (
  <PanelHarness initial={initial} width={width} view={view} />
);

/** Empty, max-width (9713:9223). "+ Filter" opens Add filter group and the parameter groups. */
export const Empty: Story = { render: () => render(blankFilter) };

/** One card, set to AND (9956:7609). */
export const SetToAnd: Story = { render: () => render(singleCardFilter) };

/** One card, set to OR (9956:7688). */
export const SetToOr: Story = { render: () => render(orFilter) };

/** Nested groups three levels deep, with a second card joined by AND (10245:4907). */
export const Nested: Story = { render: () => render(nestedFilter) };

/** The "{ }" view: the filter as LDAP (10012:4232). */
export const QuerySyntax: Story = { render: () => render(nestedFilter, 512, 'query') };

/** Min-width (338), empty (9722:12155). */
export const MinWidthEmpty: Story = { render: () => render(blankFilter, 338) };

/** Min-width (338): the condition stacks along a tree trail (9722:12325). */
export const MinWidthCondition: Story = { render: () => render(singleCardFilter, 338) };

/** Min-width (338), nested (9722:13357). */
export const MinWidthNested: Story = { render: () => render(nestedFilter, 338) };

/** Min-width (338), query syntax (9722:13787). */
export const MinWidthQuerySyntax: Story = { render: () => render(nestedFilter, 338, 'query') };
