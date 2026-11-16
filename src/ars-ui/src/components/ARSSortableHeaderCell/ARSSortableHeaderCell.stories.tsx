import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSSortableHeaderCell } from './ARSSortableHeaderCell.js';

const meta = {
  title: 'ARS/Missing from Figma/IM / Sortable header cell',
  component: ARSSortableHeaderCell,
  tags: ['missing-from-figma'],
  parameters: {
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: IM / Sortable header cell · Attestation | ReCertification · 1262:1547, on the Iris ".Table head item" with a right icon (Iris UI Kit 7814:4203). Clicking opens the Iris Menu: Sort ascending, Sort descending and, for a column with a value list, its values with checkboxes (a multi-select filter that stays open). The icons use the content colours, which pass 3:1 contrast where Figma\'s do not.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div role="table" aria-label="Users">
        <div role="row" style={{ display: 'flex' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    label: 'Status',
    style: { width: 160 },
    onSort: () => {},
    filter: { options: ['Active', 'Inactive', 'Pending', 'Unknown'], selected: [], onChange: () => {} },
  },
} satisfies Meta<typeof ARSSortableHeaderCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default" (1262:1548). */
export const Default: Story = {};

/** Figma "State=Hover" (1262:1552). */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };

/** Figma "State=Sorted ascending" (1262:1556). */
export const SortedAscending: Story = { args: { sort: 'ascending' } };

/** Figma "State=Sorted descending" (1262:1560). */
export const SortedDescending: Story = { args: { sort: 'descending' } };

/** Figma "State=Filtered" (1499:22620). */
export const Filtered: Story = {
  args: { filtered: true, filter: { options: ['Active', 'Inactive', 'Pending', 'Unknown'], selected: ['Inactive'], onChange: () => {} } },
};

/** Not drawn in Figma: a sorted column with a filter shows both icons. */
export const SortedAndFiltered: Story = { args: { sort: 'ascending', filtered: true } };

/** With the leading icon the ARS list heads draw. */
export const WithIcon: Story = { args: { label: 'Display name', icon: 'IdentificationCard', style: { width: 180 } } };

/** A column without a value list (free text): the menu has the sort items only. */
export const SortOnly: Story = { args: { label: 'Description', filter: undefined } };
