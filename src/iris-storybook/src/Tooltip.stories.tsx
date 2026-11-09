import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '@iris/components/Tooltip/Tooltip.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';

const meta = {
  title: 'Iris/Tooltip',
  component: Tooltip,
  parameters: {
    docs: { description: { component: 'Accessible tip that shows when its trigger is hovered or focused. Iris code: src/iris-shell/src/components/Tooltip.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--oi-spacing-xxxl)' }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Refresh', children: <IconButton icon="ArrowsClockwise" ariaLabel="Refresh" /> },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Top: Story = { args: { placement: 'top' } };

export const Bottom: Story = { args: { placement: 'bottom' } };

export const WithShortcut: Story = {
  name: 'With shortcut',
  args: { label: 'Search', shortcut: ['⌘', 'K'], children: <IconButton icon="MagnifyingGlass" ariaLabel="Search" /> },
};

export const LongText: Story = {
  name: 'Long text',
  args: { label: 'Refresh to see changes made by other administrators.' },
};

export const FollowCursor: Story = {
  name: 'Follow cursor',
  args: {
    label: 'Follows the pointer',
    followCursor: true,
    children: (
      <div
        tabIndex={0}
        style={{
          padding: 'var(--oi-spacing-xxxl)',
          border: 'var(--oi-border-width-default) var(--oi-border-style-solid) var(--oi-border-color-default)',
          borderRadius: 'var(--oi-border-radius-l)',
          backgroundColor: 'var(--oi-background-color-primary)',
          color: 'var(--oi-content-color-secondary)',
        }}
      >
        Move the pointer across this area
      </div>
    ),
  },
};

export const NoDelay: Story = { name: 'No delay', args: { delay: 0 } };

export const Toolbar: Story = {
  parameters: {
    docs: { description: { story: 'Once one tip is showing, moving to the next button shows its tip straight away.' } },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--oi-spacing-s)' }}>
      <Tooltip {...args} label="Refresh">
        <IconButton icon="ArrowsClockwise" ariaLabel="Refresh" />
      </Tooltip>
      <Tooltip {...args} label="Customize">
        <IconButton icon="Sliders" ariaLabel="Customize" />
      </Tooltip>
      <Tooltip {...args} label="Export">
        <IconButton icon="Export" ariaLabel="Export" />
      </Tooltip>
    </div>
  ),
};
