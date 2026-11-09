import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList } from '@iris/components/DescriptionList/DescriptionList.js';
import { Badge } from '@iris/components/Badge/Badge.js';
import { Link } from '@iris/components/Link/Link.js';

const meta = {
  title: 'Iris/DescriptionList',
  component: DescriptionList,
  parameters: {
    docs: { description: { component: 'List of label and value pairs shown as a two-column grid. Iris code: src/iris-shell/src/components/DescriptionList.' } },
  },
  args: {
    items: [
      { label: 'First name', value: 'Sofia' },
      { label: 'Last name', value: 'Nguyen' },
      { label: 'Display name', value: 'Sofia Nguyen' },
      { label: 'User principal name', value: 'SNguyen@O1D.local' },
      { label: 'Description', value: 'Oversees platform administration.' },
    ],
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRichValues: Story = {
  name: 'With rich values',
  args: {
    items: [
      { label: 'Account status', value: <Badge tone="success">Enabled</Badge> },
      { label: 'Manager', value: <Link href="#">David Smith</Link> },
      { label: 'Member of', value: <Link href="#">Sales Division</Link> },
      { label: 'Location', value: 'Active Directory\\Test OU' },
    ],
  },
};
