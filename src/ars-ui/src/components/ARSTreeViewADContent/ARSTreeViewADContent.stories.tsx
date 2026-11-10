import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSTreeViewADContent } from './ARSTreeViewADContent.js';
import { adObjectRows, paging } from '../../stories/tableSamples.js';

function Demo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(paging.page);
  return (
    <ARSTreeViewADContent
      header={HEADER}
      rows={adObjectRows}
      selected={selected}
      onSelectionChange={setSelected}
      pagination={{ ...paging, page, onPageChange: setPage }}
    />
  );
}

const meta = {
  title: 'ARS/Tree_View_AD_Content',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Figma: Tree_View_AD_Content · ARS - Primary · 4517:19943. ARS_Header (Variant1), ARS_Table_Toolbar (Basic), a table built from Iris table head items and cells (Name, Object type, Description, a 70px column with Ghost icon buttons) and ARS_Pagination.',
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

const HEADER = { title: 'Test OU' };

export const Default: Story = {};
