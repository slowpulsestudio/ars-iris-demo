import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@iris/components/Card/Card.js';
import { Button } from '@iris/components/Button/Button.js';
import { DescriptionList } from '@iris/components/DescriptionList/DescriptionList.js';

const meta = {
  title: 'Iris/Card',
  component: Card,
  parameters: {
    docs: { description: { component: 'Bordered content surface with an optional header for a title, helper text and actions. Iris code: src/iris-shell/src/components/Card.' } },
  },
  args: {
    title: 'Properties',
    helper: 'Manage identity and display names.',
    actions: (
      <Button variant="secondary" size="s">
        Edit
      </Button>
    ),
    children: (
      <DescriptionList
        items={[
          { label: 'First name', value: 'Sofia' },
          { label: 'Last name', value: 'Nguyen' },
          { label: 'Display name', value: 'Sofia Nguyen' },
          { label: 'Location', value: 'Active Directory\\Test OU' },
        ]}
      />
    ),
  },
  argTypes: { actions: { control: false }, children: { control: false } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  name: 'Title only',
  args: { helper: undefined, actions: undefined },
};

export const WithoutHeader: Story = {
  name: 'Without header',
  args: { title: undefined, helper: undefined, actions: undefined },
};
