import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavItem } from '@iris/components/NavItem/NavItem.js';

// The rest of the Active Roles directory panel, below Users.
const OTHER_ENTITIES = [
  { label: 'Groups', icon: 'UsersThree' },
  { label: 'Devices', icon: 'Devices' },
  { label: 'Agents', icon: 'Robot' },
  { label: 'Applications', icon: 'Browsers' },
  { label: 'Access templates', icon: 'UserCircleCheck' },
  { label: 'Management units', icon: 'FolderSimpleStar' },
];

const meta = {
  title: 'Iris/NavItem',
  component: NavItem,
  parameters: {
    docs: { description: { component: 'Single row in a sidebar nav list. Iris code: src/iris-shell/src/components/NavItem.' } },
  },
  args: { icon: 'Users', label: 'Users' },
  // The first row follows the controls; the other rows complete the list.
  render: (args) => (
    <nav
      aria-label="Directory entities"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--oi-spacing-2)',
        // Default width of the directory sidebar.
        width: 254,
        padding: 'var(--oi-spacing-s) var(--oi-spacing-l)',
        backgroundColor: 'var(--oi-background-color-primary)',
      }}
    >
      <NavItem {...args} />
      {OTHER_ENTITIES.map((item) => (
        <NavItem key={item.label} icon={item.icon} label={item.label} />
      ))}
    </nav>
  ),
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { selected: true } };
