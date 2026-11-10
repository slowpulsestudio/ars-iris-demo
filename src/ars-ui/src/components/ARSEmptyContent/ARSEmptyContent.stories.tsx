import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSEmptyContent } from './ARSEmptyContent.js';

const meta = {
  title: 'ARS/ARS_Empty_Content',
  component: ARSEmptyContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma: ARS_Empty_Content · ARS - Primary · 3423:30769. ARS_Header ("Customize next to object class"), ARS_Table_Toolbar ("Split") and the "No data" empty state (3367:42208) with a Secondary Icon + Text button.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 930, padding: 'var(--oi-spacing-l)', boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    header: { title: 'My OU', objectClass: 'Organizational Unit', objectName: 'AD 1' },
    message: 'This Organizational Unit has no objects.',
    actionLabel: 'Add object',
  },
} satisfies Meta<typeof ARSEmptyContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
