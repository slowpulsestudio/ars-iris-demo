import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSFilterSelect } from './ARSFilterSelect.js';

const computer = { kind: 'object', label: 'Computer', icon: 'Desktop' } as const;
const is = { kind: 'rule', label: 'is' } as const;

const meta = {
  title: 'ARS/ARS_filter-select',
  component: ARSFilterSelect,
  parameters: {
    docs: { description: { component: 'Figma: ARS_filter-select · ARS - Primary · 2650:24519' } },
  },
  args: { parts: [{ kind: 'field', label: 'Object Type' }, is, computer] },
} satisfies Meta<typeof ARSFilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Version=Default" (2650:24520). */
export const Default: Story = {};

/** Figma "Version=2" (2650:24535). */
export const Version2: Story = { name: '2', args: { parts: [computer, is, computer, is, computer] } };
