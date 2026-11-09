import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, type TabItem, type TabsProps } from '@iris/components/Tabs/Tabs.js';

const TABS: TabItem[] = [
  { value: 'general', label: 'General' },
  { value: 'account', label: 'Account' },
  { value: 'member-of', label: 'Member of' },
];

const TABS_WITH_ICONS: TabItem[] = [
  { value: 'general', label: 'General', icon: 'IdentificationCard' },
  { value: 'account', label: 'Account', icon: 'UserCircle' },
  { value: 'member-of', label: 'Member of', icon: 'UsersThree' },
  { value: 'history', label: 'History', icon: 'ClockCounterClockwise' },
];

const MANY_TABS: TabItem[] = [
  'General',
  'Address',
  'Account',
  'Profile',
  'Telephones',
  'Organization',
  'Member of',
  'Dial-in',
  'Object',
  'Security',
  'Attribute editor',
].map((label) => ({ value: label, label }));

function TabsDemo(args: TabsProps) {
  const [value, setValue] = useState(args.value);
  return <Tabs {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Iris/Tabs',
  component: Tabs,
  parameters: {
    docs: { description: { component: 'Tab strip with arrow-key navigation and a sliding underline; tabs that do not fit move into a "…" overflow menu. Iris code: src/iris-shell/src/components/Tabs.' } },
  },
  args: { items: TABS, value: 'general', onChange: () => {}, ariaLabel: 'User properties' },
  render: (args) => <TabsDemo key={args.value} {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = { name: 'With icons', args: { items: TABS_WITH_ICONS } };

export const Overflow: Story = {
  args: { items: MANY_TABS, value: 'General' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
