import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSAppLayoutFlatView } from './ARSAppLayoutFlatView.js';
import { ARSDirectoryManagementPanel, type ARSDirectoryView } from '../ARSDirectoryManagementPanel/ARSDirectoryManagementPanel.js';
import { ARSDirectoryManagementContent } from '../ARSDirectoryManagementContent/ARSDirectoryManagementContent.js';
import { ARSMainContentPlaceholder } from '../ARSMainContentPlaceholder/ARSMainContentPlaceholder.js';
import { IrisAppProviders, signedInUser, withRoute } from '../../stories/IrisAppProviders.js';
import { directoryOptions, directorySelected, flatItems } from '../../stories/directorySamples.js';

function Demo() {
  const [view, setView] = useState<ARSDirectoryView>('flat');
  const [directories, setDirectories] = useState(new Set(directorySelected));
  const [selectedId, setSelectedId] = useState<string | null>('users');
  return (
    <ARSAppLayoutFlatView
      header={{ breadcrumb: [{ label: 'Directory Management' }, { label: 'Users' }], user: signedInUser, sidebarOpen: false }}
      panel={
        <ARSDirectoryManagementPanel
          view={view}
          onViewChange={setView}
          directories={{ options: directoryOptions, selected: directories, onSelectionChange: setDirectories }}
        >
          <ARSDirectoryManagementContent variant="flat" items={flatItems} selectedId={selectedId} onSelect={setSelectedId} />
        </ARSDirectoryManagementPanel>
      }
    >
      <ARSMainContentPlaceholder />
    </ARSAppLayoutFlatView>
  );
}

const meta = {
  title: 'ARS/ARS_App_Layout_Flat_View',
  component: Demo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma: ARS_App_Layout_Flat_View · ARS - Primary · 2385:56316. Iris AppHeader (sidebar collapsed), ARS_Directory_Management_Panel (Flat view) and ARS_Main_Content Placeholder.',
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

export const Default: Story = {};
