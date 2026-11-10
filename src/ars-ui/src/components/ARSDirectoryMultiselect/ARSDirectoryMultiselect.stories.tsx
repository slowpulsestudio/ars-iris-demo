import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSDirectoryMultiselect, type ARSDirectoryMultiselectProps } from './ARSDirectoryMultiselect.js';
import { directoryOptions, directorySelected } from '../../stories/directorySamples.js';

function Demo(args: ARSDirectoryMultiselectProps) {
  const [selected, setSelected] = useState(args.selected);
  return <ARSDirectoryMultiselect {...args} selected={selected} onSelectionChange={setSelected} />;
}

const meta = {
  title: 'ARS/ARS_Directory_Multiselect',
  component: ARSDirectoryMultiselect,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Directory_Multiselect · ARS - Primary · 4596:20589. The Iris MultiSelect panel (UI Kit MultiSelect 8584:9634: search input, six multi-select items, Ghost Text-only Clear and Select all) opened from the Iris Select (Large) used in ARS_Directory_Management_Panel.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 222, height: 520 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: directoryOptions,
    selected: new Set(directorySelected),
    onSelectionChange: () => {},
    defaultOpen: true,
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ARSDirectoryMultiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
