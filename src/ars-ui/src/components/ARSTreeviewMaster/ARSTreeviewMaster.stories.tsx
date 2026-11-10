import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTreeviewMaster } from './ARSTreeviewMaster.js';
import { IrisAppProviders, signedInUser, withRoute } from '../../stories/IrisAppProviders.js';
import { directoryTree } from '../../stories/directorySamples.js';
import { adObjectRows, paging } from '../../stories/tableSamples.js';

function Demo() {
  const [selectedId, setSelectedId] = useState<string | null>('tenant/users');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(paging.page);
  return (
    <ARSTreeviewMaster
      header={{
        breadcrumb: [{ label: 'Directory Management' }, { label: 'Entra ID' }, { label: 'Groups' }, { label: 'Security Users' }],
        user: signedInUser,
        sidebarOpen: false,
      }}
      tree={{
        nodes: directoryTree,
        selectedId,
        onSelect: setSelectedId,
        defaultExpandedIds: ['managed', 'entra', 'tenant'],
      }}
      content={{
        header: HEADER,
        rows: adObjectRows,
        selected,
        onSelectionChange: setSelected,
        pagination: { ...paging, page, onPageChange: setPage },
      }}
    />
  );
}

const meta = {
  title: 'ARS/ARS_Treeview_Master',
  component: Demo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma: ARS_Treeview_Master · ARS - Primary · 3367:42088. The application layout with the Tree view panel (Users selected under the Entra tenant) and Tree_View_AD_Content. Figma shows the header as a detached frame; here it is the Iris AppHeader with the same breadcrumb.',
      },
    },
  },
  beforeEach: () => withRoute('#/users'),
  decorators: [
    (Story) => (
      <IrisAppProviders>
        <div style={{ height: 982 }}>
          <Story />
        </div>
      </IrisAppProviders>
    ),
  ],
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

const HEADER = { title: 'Test OU' };

export const Default: Story = {};
