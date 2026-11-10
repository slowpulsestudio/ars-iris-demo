import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFlatMaster } from './ARSFlatMaster.js';
import { IrisAppProviders, signedInUser, withRoute } from '../../stories/IrisAppProviders.js';
import { directoryOptions, directorySelected, flatItems } from '../../stories/directorySamples.js';
import { flatUserRows, paging } from '../../stories/tableSamples.js';

function Demo() {
  const [directories, setDirectories] = useState(new Set(directorySelected));
  const [selectedId, setSelectedId] = useState<string | null>('users');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(paging.page);
  return (
    <ARSFlatMaster
      header={{ breadcrumb: [{ label: 'Directory Management' }, { label: 'Users' }], user: signedInUser, sidebarOpen: false }}
      directories={{ options: directoryOptions, selected: directories, onSelectionChange: setDirectories }}
      nav={{ items: flatItems, selectedId, onSelect: setSelectedId }}
      content={{
        header: HEADER,
        table: { rows: flatUserRows, selected, onSelectionChange: setSelected, ...paging, page, onPageChange: setPage },
      }}
    />
  );
}

const meta = {
  title: 'ARS/ARS_Flat_Master',
  component: Demo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma: ARS_Flat_Master · ARS - Primary · 4006:17053. ARS_App_Layout_Flat_View with the Flat view panel and ARS_Flat View_User_Content.',
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

const HEADER = { title: 'Users' };

export const Default: Story = {};
