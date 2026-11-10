import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ARSDirectoryManagementPanel,
  type ARSDirectoryManagementPanelProps,
  type ARSDirectoryView,
} from './ARSDirectoryManagementPanel.js';
import { ARSDirectoryManagementContent } from '../ARSDirectoryManagementContent/ARSDirectoryManagementContent.js';
import {
  directoryOptions,
  directorySelected,
  directoryTree,
  favoriteSections,
  flatItems,
} from '../../stories/directorySamples.js';

type TreeState = 'expanded' | 'min' | 'entra';

const TREE: Record<TreeState, { selectedId: string | null; expanded: string[] }> = {
  expanded: { selectedId: 'test-ou', expanded: ['managed', 'ad', 'o1d', 'test-ou'] },
  min: { selectedId: null, expanded: ['managed'] },
  entra: { selectedId: 'tenant/users', expanded: ['managed', 'entra', 'tenant'] },
};

interface DemoProps extends Pick<ARSDirectoryManagementPanelProps, 'view'> {
  tree?: TreeState;
}

function Demo({ view: initialView, tree = 'expanded' }: DemoProps) {
  const [view, setView] = useState<ARSDirectoryView>(initialView);
  const [directories, setDirectories] = useState(new Set(directorySelected));
  const [selectedId, setSelectedId] = useState<string | null>(
    view === 'flat' ? 'users' : view === 'tree' ? TREE[tree].selectedId : null,
  );
  return (
    <ARSDirectoryManagementPanel
      view={view}
      onViewChange={setView}
      directories={{ options: directoryOptions, selected: directories, onSelectionChange: setDirectories }}
    >
      {view === 'flat' && (
        <ARSDirectoryManagementContent variant="flat" items={flatItems} selectedId={selectedId} onSelect={setSelectedId} />
      )}
      {view === 'tree' && (
        <ARSDirectoryManagementContent
          variant="tree"
          nodes={directoryTree}
          selectedId={selectedId}
          onSelect={setSelectedId}
          defaultExpandedIds={TREE[tree].expanded}
        />
      )}
      {view === 'favorites' && (
        <ARSDirectoryManagementContent
          variant="favorites"
          sections={favoriteSections}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
    </ARSDirectoryManagementPanel>
  );
}

const meta = {
  title: 'ARS/ARS_Directory_Management_Panel',
  component: Demo,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Directory_Management_Panel · ARS - Primary · 2385:54213. The ARS view switch (plain frame 2385:54130: Flat view, Tree view, Favorites), the directory picker (Flat view only; ARS_Directory_Multiselect on an Iris Select, Large) and ARS_Directory_Management_Content.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 852 }}>
        <Story />
      </div>
    ),
  ],
  args: { view: 'flat' },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatView: Story = {
  name: 'Flat view',
  parameters: { docs: { description: { story: 'Figma 2385:54212.' } } },
};

export const TreeViewExpanded: Story = {
  name: 'Tree view - Expanded',
  parameters: { docs: { description: { story: 'Figma 2385:54214.' } } },
  args: { view: 'tree', tree: 'expanded' },
};

export const TreeViewMin: Story = {
  name: 'Tree view - Min',
  parameters: { docs: { description: { story: 'Figma 2385:55184.' } } },
  args: { view: 'tree', tree: 'min' },
};

export const TreeViewEntra: Story = {
  name: 'Tree view - Entra',
  parameters: { docs: { description: { story: 'Figma 2385:55610.' } } },
  args: { view: 'tree', tree: 'entra' },
};

export const Favorites: Story = {
  parameters: { docs: { description: { story: 'Figma 3991:36687 in panel 3991:35734.' } } },
  args: { view: 'favorites' },
};
