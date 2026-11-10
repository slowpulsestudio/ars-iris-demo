import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSNewObjectContent } from './ARSNewObjectContent.js';

const meta = {
  title: 'ARS/ARS_New_Object_Content',
  component: ARSNewObjectContent,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_New_Object_Content · ARS - Primary · 3493:17061. Fields are Iris FormField + TextInput with the ARS grey fill; account options are Iris Checkboxes. The "Select destination folder" button is hidden in Figma and shown where ARS_New_Object_Template uses this content.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Default', 'Variant2'] },
    layout: { control: 'inline-radio', options: ['default', 'container'] },
  },
  decorators: [(Story) => <div style={{ width: 1122 }}><Story /></div>],
} satisfies Meta<typeof ARSNewObjectContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (3493:16919). */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Variant2" (3493:17062). */
export const Variant2: Story = { args: { variant: 'Variant2' } };

/** As ARS_New_Object_Template shows it: the hidden folder button made visible. */
export const WithFolderButton: Story = { name: 'With folder button', args: { showFolderButton: true } };
