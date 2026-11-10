import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSManagedBy } from './ARSManagedBy.js';

const meta = {
  title: 'ARS/ARS_Managed_by',
  component: ARSManagedBy,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Managed_by · ARS - Primary · 3527:16182. Labels keep Figma's spellings in each state (e.g. State/Proviance, State/Province, State/Provance). Country/Region is the Iris Select, as Figma links it.",
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['Empty', 'Hover', 'Add manager', 'Edit mode', 'Filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 871 }}><Story /></div>],
} satisfies Meta<typeof ARSManagedBy>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Empty" (3527:16183). */
export const Empty: Story = { args: { state: 'Empty' } };

/** Figma "State=Hover" (3527:16237). */
export const Hover: Story = { args: { state: 'Hover' } };

/** Figma "State=Add manager" (3527:16293). */
export const AddManager: Story = { name: 'Add manager', args: { state: 'Add manager' } };

/** Figma "State=Edit mode" (3527:16319). */
export const EditMode: Story = { name: 'Edit mode', args: { state: 'Edit mode' } };

/** Figma "State=Filled" (3527:16356). */
export const Filled: Story = { args: { state: 'Filled' } };
