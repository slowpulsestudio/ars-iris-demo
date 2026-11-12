import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSHeader } from './ARSHeader.js';

const meta = {
  title: 'ARS/ARS_Header',
  component: ARSHeader,
  parameters: {
    docs: { description: { component: 'Figma: ARS_Header · ARS - Primary · 3368:19597' } },
  },
} satisfies Meta<typeof ARSHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=Variant1" (3368:19598). */
export const Variant1: Story = { args: { variant: 'Variant1', title: 'AD 1' } };

/** Figma "Variant=Customize top-right" (3368:19612). */
export const CustomizeTopRight: Story = {
  name: 'Customize top-right',
  args: { variant: 'Customize top-right', title: 'My OU', objectClass: 'Organizational unit', objectName: 'AD 1' },
};

/** Figma "Variant=Customize next to object class" (3368:19629). */
export const CustomizeNextToObjectClass: Story = {
  name: 'Customize next to object class',
  args: { variant: 'Customize next to object class', title: 'My OU', objectClass: 'Organizational unit', objectName: 'AD 1' },
};

/** Figma "Variant=User" (3368:19806). */
export const User: Story = {
  args: { variant: 'User', title: 'Ethan Brooks', objectClass: 'User', objectName: 'Ethan.Brooks2' },
};

/** Figma "Variant=Back bar" (3425:18289). */
export const BackBar: Story = {
  name: 'Back bar',
  args: { variant: 'Back bar', title: 'Ethan Brooks', objectClass: 'User', objectName: 'Ethan.Brooks2', tag: 'Management' },
};

/** The header on ARS - Favorites (4145:13699 in ARS_WebUI2_Advanced-Search): FolderStar, "class · name", no back or pager. Not a variant in ARS - Primary. */
export const Favorites: Story = {
  args: { variant: 'Favorites', title: 'My OU', objectClass: 'Organizational unit', objectName: 'O1D.local' },
};
