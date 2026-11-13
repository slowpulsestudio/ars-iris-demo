import type { Meta, StoryObj } from '@storybook/react-vite';
import { GROUP_OBJECT_ID, GROUPS } from '../../stories/groupSamples.js';
import { ARSTableGroupRow } from './ARSTableGroupRow.js';

const ORDER = [
  'securityUsers',
  'allCompany',
  'marketingTeam',
  'developmentCrew',
  'salesDivision',
  'customerSupport',
  'productManagement',
  'humanResources',
];

const meta = {
  title: 'ARS/ARS_Table_Group_Row',
  component: ARSTableGroupRow,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Table_Group_Row · ARS - Primary · 2843:24711. Figma has 24 variants: 8 sample groups, each as 1 (default), 2 (hovered) and 3 (selected). The "All variants" story shows them all.',
      },
    },
  },
  args: { ...GROUPS.securityUsers, objectId: GROUP_OBJECT_ID },
  decorators: [(Story) => <div style={{ maxWidth: 1178 }}><Story /></div>],
} satisfies Meta<typeof ARSTableGroupRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=SecUser1" (2843:24712). */
export const Default: Story = {};

/** Figma "Property 1=SecUser2" (2843:24776). */
export const Hovered: Story = { parameters: { pseudo: { hover: true } } };

/** Figma "Property 1=SecUser3" (2843:24840). */
export const Selected: Story = { args: { selected: true } };

/** A row of the Groups file's Memberships table (ARS_WebUI2_Groups 167:8097): the type icon, the name in primary text and a remove button. */
export const Memberships: Story = { args: { variant: 'Memberships', icon: 'UsersThree' } };

/** All 24 Figma variants: each group default, hovered, then selected. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { pseudo: { hover: ['.figma-hover'] } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oi-spacing-xl)' }}>
      {ORDER.flatMap((key) =>
        [1, 2, 3].map((state) => (
          <ARSTableGroupRow
            key={`${key}${state}`}
            {...GROUPS[key]}
            objectId={GROUP_OBJECT_ID}
            selected={state === 3}
            className={state === 2 ? 'figma-hover' : undefined}
          />
        )),
      )}
    </div>
  ),
};
