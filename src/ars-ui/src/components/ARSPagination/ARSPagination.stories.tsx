import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPagination } from './ARSPagination.js';

const meta = {
  title: 'ARS/ARS_Pagination',
  component: ARSPagination,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Pagination · ARS - Primary · 82:31768' } },
  },
} satisfies Meta<typeof ARSPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As in Figma: page 1 of 154, 10 per page. */
export const Default: Story = {
  args: { page: 1, pageCount: 154, pages: [1, 2, 3, 4, 'ellipsis', 154], pageSize: 10 },
};
