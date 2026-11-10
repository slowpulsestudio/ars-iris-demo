import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSModalNewObjectFooter } from './ARSModalNewObjectFooter.js';

const meta = {
  title: 'ARS/ARS_.Modal_New_Object_Footer',
  component: ARSModalNewObjectFooter,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_.Modal_New_Object_Footer · ARS - Primary · 3321:20516. Back is the Iris ghost icon button (disabled on step 1); the main action is the Iris primary button (disabled until step 1 is complete).',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['1', '1_complete', '2'] },
  },
  decorators: [(Story) => <div style={{ width: 1186 }}><Story /></div>],
} satisfies Meta<typeof ARSModalNewObjectFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Property 1=1" (3247:43218). */
export const Step1: Story = { name: '1', args: { variant: '1' } };

/** Figma "Property 1=1_complete" (3321:20578). */
export const Step1Complete: Story = { name: '1_complete', args: { variant: '1_complete' } };

/** Figma "Property 1=2" (3321:20623). */
export const Step2: Story = { name: '2', args: { variant: '2' } };
