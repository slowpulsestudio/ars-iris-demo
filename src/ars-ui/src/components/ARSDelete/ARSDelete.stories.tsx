import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSDelete } from './ARSDelete.js';

const meta = {
  title: 'ARS/Missing from Figma/ARS_Delete',
  component: ARSDelete,
  tags: ['missing-from-figma'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Missing from Figma: not in ARS - Primary. Figma: ARS_Delete · ARS_WebUI2_CRUD · 1755:15058 (variants Delete Object 1755:15057, Delete Object_Load 1755:15056, Delete Object_Success 1755:15055). The 620px modal: type the name to confirm, wait, then the result. Delete user stays disabled until the name is typed.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Delete Object', 'Delete Object_Load', 'Delete Object_Success'] },
  },
} satisfies Meta<typeof ARSDelete>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=ARS_Delete Object" (1755:15057). */
export const DeleteObject: Story = { args: { variant: 'Delete Object' } };

/** Figma "Property 1=ARS_Delete Object_Load" (1755:15056). */
export const DeleteObjectLoad: Story = { args: { variant: 'Delete Object_Load' } };

/** Figma "Property 1=ARS_Delete Object_Success" (1755:15055). */
export const DeleteObjectSuccess: Story = { args: { variant: 'Delete Object_Success' } };
