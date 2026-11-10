import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, type PaginationProps } from '@iris/components/Pagination/Pagination.js';

function PaginationDemo(args: PaginationProps) {
  const [page, setPage] = useState(args.page);
  const [pageSize, setPageSize] = useState(args.pageSize);
  return (
    <Pagination
      {...args}
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
    />
  );
}

const meta = {
  title: 'Iris/Pagination',
  component: Pagination,
  parameters: {
    docs: { description: { component: 'Navigation between the pages of a paged collection, shown as numbered page buttons or as Previous and Next only. Iris code: src/iris-shell/src/components/Pagination.' } },
  },
  args: { page: 1, pageCount: 10, onPageChange: () => {} },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'simplified'] } },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MiddlePage: Story = {
  name: 'Middle page',
  args: { page: 5, pageCount: 20 },
  render: (args) => <PaginationDemo key={`${args.page}-${args.pageSize}`} {...args} />,
};

export const LastPage: Story = { name: 'Last page', args: { page: 10, pageCount: 10 } };

export const FewPages: Story = { name: 'Few pages', args: { pageCount: 3 } };

export const Simplified: Story = { args: { variant: 'simplified' } };

/** Iris UI Kit "Page action=First" and "Page action=Last". */
export const FirstAndLast: Story = { name: 'First and last', args: { showFirstLast: true } };

export const WithPageSize: Story = {
  name: 'With page size',
  args: { pageSize: 20 },
  // Size container, as in the app's pagination footer, so the layout adapts to narrow widths.
  decorators: [
    (Story) => (
      <div style={{ containerType: 'inline-size' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <PaginationDemo key={`${args.page}-${args.pageSize}`} {...args} />,
};

export const SiblingAndBoundaryCount: Story = {
  name: 'Sibling and boundary count',
  args: { page: 10, pageCount: 20, siblingCount: 2, boundaryCount: 2 },
};
