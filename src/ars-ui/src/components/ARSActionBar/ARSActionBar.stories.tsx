import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSActionBar } from './ARSActionBar.js';

const meta = {
  title: 'ARS/ARS_Action_bar',
  component: ARSActionBar,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Action_bar · ARS - Primary · 2385:59821. The Iris ActionBar. Only the Default variant is linked to the action bar component in Figma; "2" and "Variant3" are unlinked copies that add the total ("5 of 122") and a "Show selected" Iris Toggle. In "2", Figma draws Reset password and the ··· button 32px tall; here every action is the bar\'s 24px button. Figma annotation: the bar sits 21px above the bottom of the page, centred in the content area.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['Default', '2', 'Variant3'] },
  },
  args: { layout: 'inline' },
  decorators: [(Story) => <div style={{ padding: '24px 0' }}><Story /></div>],
} satisfies Meta<typeof ARSActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=Default" (2385:56533). */
export const Default: Story = { args: { variant: 'Default' } };

/** Figma "Variant=2" (2385:59822). */
export const Variant2: Story = { name: '2', args: { variant: '2' } };

/** Figma "Variant=Variant3" (3851:15702). */
export const Variant3: Story = { args: { variant: 'Variant3' } };
