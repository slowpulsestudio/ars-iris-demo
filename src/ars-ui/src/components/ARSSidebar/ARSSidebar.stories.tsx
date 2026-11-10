import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSSidebar, type ARSSidebarProps } from './ARSSidebar.js';
import { IrisAppProviders, withRoute } from '../../stories/IrisAppProviders.js';

function Demo(args: ARSSidebarProps) {
  const [activeItem, setActiveItem] = useState(args.activeItem);
  return <ARSSidebar {...args} activeItem={activeItem} onItemChange={setActiveItem} />;
}

const meta = {
  title: 'ARS/ARS_Sidebar',
  component: ARSSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Figma: ARS_Sidebar · ARS - Primary · 2385:56389. The Iris UI Kit Sidebar (Active Roles): the Iris GlobalSidebar, pinned open.',
      },
    },
  },
  beforeEach: () => withRoute('#/users'),
  decorators: [
    (Story) => (
      <IrisAppProviders>
        <div style={{ position: 'relative', display: 'flex', height: 852, overflow: 'hidden' }}>
          <Story />
        </div>
      </IrisAppProviders>
    ),
  ],
  args: { open: true, activeItem: 'directory' },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ARSSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
