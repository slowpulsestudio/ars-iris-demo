import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSOwnership } from './ARSOwnership.js';

const meta = {
  title: 'ARS/ARS_Ownership',
  component: ARSOwnership,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Ownership · ARS - Primary · 3527:16049. As in Figma, the secondary owners read state also shows "Add owner".',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Manager', 'Secondary owner'] },
    state: { control: 'inline-radio', options: ['Empty', 'Add', 'Read state', 'Edit state'] },
  },
} satisfies Meta<typeof ARSOwnership>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=Manager, State=Empty" (3527:16050). */
export const ManagerEmpty: Story = { name: 'Manager, Empty', args: { variant: 'Manager', state: 'Empty' } };

/** Figma "Variant=Manager, State=Add" (3527:16056). */
export const ManagerAdd: Story = { name: 'Manager, Add', args: { variant: 'Manager', state: 'Add' } };

/** Figma "Variant=Manager, State=Read state" (3527:16062). */
export const ManagerRead: Story = { name: 'Manager, Read state', args: { variant: 'Manager', state: 'Read state' } };

/** Figma "Variant=Manager, State=Edit state" (3527:16069). */
export const ManagerEdit: Story = { name: 'Manager, Edit state', args: { variant: 'Manager', state: 'Edit state' } };

/** Figma "Variant=Secondary owner, State=Empty" (3527:16077). */
export const OwnerEmpty: Story = {
  name: 'Secondary owner, Empty',
  args: { variant: 'Secondary owner', state: 'Empty' },
};

/** Figma "Variant=Secondary owner, State=Add" (3527:16084). */
export const OwnerAdd: Story = { name: 'Secondary owner, Add', args: { variant: 'Secondary owner', state: 'Add' } };

/** Figma "Variant=Secondary owner, State=Edit state" (3527:16091). */
export const OwnerEdit: Story = {
  name: 'Secondary owner, Edit state',
  args: { variant: 'Secondary owner', state: 'Edit state' },
};

/** Figma "Variant=Secondary owner, State=Read state" (3527:16108). */
export const OwnerRead: Story = {
  name: 'Secondary owner, Read state',
  args: { variant: 'Secondary owner', state: 'Read state' },
};
