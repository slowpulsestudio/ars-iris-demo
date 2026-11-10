import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSResetContentSuccess } from './ARSResetContentSuccess.js';

const meta = {
  title: 'ARS/Reset_Content success',
  component: ARSResetContentSuccess,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: Reset_Content success · ARS - Primary · 4486:19024. Plain frames in Figma (audit); the password field is a plain copy of a text input, here the Iris TextInput with copy and show / hide controls. Copying swaps the copy icon for the green check for two seconds.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Default', 'Copied'] },
  },
  decorators: [(Story) => <div style={{ width: 556 }}><Story /></div>],
} satisfies Meta<typeof ARSResetContentSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=Default" (4486:19025). */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Property 1=Copied" (4486:19045). */
export const Copied: Story = { args: { variant: 'Copied' } };
