import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSPageContent } from './ARSPageContent.js';

const meta = {
  title: 'ARS/ARS_Page_Content',
  component: ARSPageContent,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Page_Content · ARS - Primary · 2944:30346' } },
  },
  decorators: [(Story) => <div style={{ maxWidth: 1308 }}><Story /></div>],
} satisfies Meta<typeof ARSPageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
