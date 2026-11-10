import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuPreview, iconTrigger } from '../../stories/MenuPreview.js';
import { ARSNewUserEntraDir } from './ARSNewUserEntraDir.js';

const meta = {
  title: 'ARS/ARS_New User Entra Dir',
  component: ARSNewUserEntraDir,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_New User Entra Dir · ARS - Primary · 2275:91121. Shown in the Iris menu, so rows and icons use the Iris menu's sizes.",
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['Entra Only', 'AD Only', 'Variant3'] } },
  render: (args) => (
    <MenuPreview height={180}>
      {(state) => <ARSNewUserEntraDir {...args} {...state} align="start" trigger={iconTrigger('Plus', 'New user')} />}
    </MenuPreview>
  ),
} satisfies Meta<typeof ARSNewUserEntraDir>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Entra Only" (2275:90966). */
export const EntraOnly: Story = { name: 'Entra Only', args: { variant: 'Entra Only' } };

/** Figma "Property 1=AD Only" (2275:91122). */
export const ADOnly: Story = { name: 'AD Only', args: { variant: 'AD Only' } };

/** Figma "Property 1=Variant3" (2275:91144). */
export const Variant3: Story = { args: { variant: 'Variant3' } };
