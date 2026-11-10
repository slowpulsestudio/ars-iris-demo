import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFlatViewUserContent } from './ARSFlatViewUserContent.js';
import { flatUserRows, paging } from '../../stories/tableSamples.js';

function Demo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(paging.page);
  return (
    <ARSFlatViewUserContent
      header={HEADER}
      table={{ rows: flatUserRows, selected, onSelectionChange: setSelected, ...paging, page, onPageChange: setPage }}
    />
  );
}

const meta = {
  title: 'ARS/ARS_Flat View_User_Content',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Figma: ARS_Flat View_User_Content · ARS - Primary · 3423:30755. ARS_Header (Variant1, User icon), ARS_Table_Toolbar (Basic) and ARS_Table (Default) in a bordered card (py xxl, gap xl).',
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

const HEADER = { title: 'Users' };

export const Default: Story = {};
