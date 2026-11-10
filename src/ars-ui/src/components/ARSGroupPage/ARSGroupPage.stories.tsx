import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSGroupPage } from './ARSGroupPage.js';

const meta = {
  title: 'ARS/ARS_Group_Page',
  component: ARSGroupPage,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Figma: ARS_Group_Page · ARS - Primary · 2944:29514' } },
  },
  decorators: [(Story) => <div style={{ height: 520 }}><Story /></div>],
} satisfies Meta<typeof ARSGroupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
