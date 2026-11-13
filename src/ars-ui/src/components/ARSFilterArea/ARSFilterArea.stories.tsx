import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFilterSelect } from '../ARSFilterSelect/ARSFilterSelect.js';
import { ARSFilterTag } from '../ARSFilterTag/ARSFilterTag.js';
import { ARSFilterArea } from './ARSFilterArea.js';

const meta = {
  title: 'ARS/Missing from Figma/filter area',
  component: ARSFilterArea,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: filter area · ARS_WebUI2_Advanced-Search · 4145:13713 (in ARS - Favorites 4145:13627). The grey strip under the toolbar: the pills, "Add" and "Clear".',
      },
    },
  },
} satisfies Meta<typeof ARSFilterArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: an Object type tag and a Date active pill (4145:13714). */
export const Default: Story = {
  render: () => (
    <ARSFilterArea onAdd={() => {}} onClear={() => {}}>
      <ARSFilterTag field="Object type" rule="is" values={['Computer', 'Group', 'User', 'Contact', 'Printer']} />
      <ARSFilterSelect
        parts={[
          { kind: 'field', label: 'Date active' },
          { kind: 'rule', label: 'is between' },
          { kind: 'object', label: '01/05/26', icon: 'CalendarBlank' },
          { kind: 'rule', label: 'and', plain: true },
          { kind: 'object', label: '28/05/26', icon: 'CalendarBlank' },
        ]}
      />
    </ARSFilterArea>
  ),
};
