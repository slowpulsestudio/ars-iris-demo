import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSDirectoryManagementContent } from './ARSDirectoryManagementContent.js';
import { directoryTree, favoriteSections, flatItems } from '../../stories/directorySamples.js';

interface DemoProps {
  variant: 'flat' | 'tree' | 'favorites';
  selectedId?: string | null;
  defaultExpandedIds?: string[];
}

function Demo({ variant, selectedId: initial = null, defaultExpandedIds }: DemoProps) {
  const [selectedId, setSelectedId] = useState(initial);
  const common = { selectedId, onSelect: setSelectedId };
  if (variant === 'flat') return <ARSDirectoryManagementContent variant="flat" items={flatItems} {...common} />;
  if (variant === 'tree')
    return (
      <ARSDirectoryManagementContent
        variant="tree"
        nodes={directoryTree}
        defaultExpandedIds={defaultExpandedIds}
        {...common}
      />
    );
  return <ARSDirectoryManagementContent variant="favorites" sections={favoriteSections} {...common} />;
}

const meta = {
  title: 'ARS/ARS_Directory_Management_Content',
  component: Demo,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Directory_Management_Content · ARS - Primary · 3563:17386. Flat view: Iris NavItems. Tree views: the Iris Tree with the ARS settings (pl s, pr m, py s, 20px indicator). Favorites: search plus Views and Objects sections of Iris NavItems.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 254, height: 500 }}>
        <Story />
      </div>
    ),
  ],
  args: { variant: 'flat', selectedId: 'users' },
  render: (args) => <Demo key={args.variant + String(args.defaultExpandedIds)} {...args} />,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatViewContent: Story = {
  name: 'ARS_Flat_View_Content',
  parameters: { docs: { description: { story: 'Figma 3563:17382.' } } },
};

export const TreeADExpandContent: Story = {
  name: 'ARS_Tree_AD_Expand_Content',
  parameters: { docs: { description: { story: 'Figma 3563:17383. Test OU selected.' } } },
  args: {
    variant: 'tree',
    selectedId: 'test-ou',
    defaultExpandedIds: ['managed', 'ad', 'o1d', 'test-ou'],
  },
};

export const TreeClosedContent: Story = {
  name: 'ARS_Tree_Closed_Content',
  parameters: { docs: { description: { story: 'Figma 3563:17384. Only Managed Directories is expanded.' } } },
  args: { variant: 'tree', selectedId: null, defaultExpandedIds: ['managed'] },
};

export const TreeExpandContent: Story = {
  name: 'ARS_Tree_Expand_Content',
  parameters: {
    docs: {
      description: {
        story: 'Figma 3563:17385. Users selected under the Entra tenant. Figma shows Users with an open caret and no children; here Users has no children.',
      },
    },
  },
  args: {
    variant: 'tree',
    selectedId: 'tenant/users',
    defaultExpandedIds: ['managed', 'entra', 'tenant'],
  },
};

export const Favorites: Story = {
  parameters: { docs: { description: { story: 'Figma 3991:36687.' } } },
  args: { variant: 'favorites', selectedId: null },
};
