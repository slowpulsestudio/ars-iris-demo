import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSOverviewTemplate } from './ARSOverviewTemplate.js';

const meta = {
  title: 'ARS/ARS_Overview_Template',
  component: ARSOverviewTemplate,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Overview_Template · ARS - Primary · 3353:38318. Uses the Iris Avatar, Badge and StatCard as they are, so a few details follow Iris rather than Figma: the avatar is Iris's largest size (40px; Figma shows 48px), and each stat card keeps Iris's caption label and options button. The OU counts use Iris's strongest weight (600; Figma shows bold).",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['User', 'Group', 'OU'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 847 }}><Story /></div>],
} satisfies Meta<typeof ARSOverviewTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=User" (3353:38372). */
export const User: Story = { args: { variant: 'User' } };

/** Figma "Variant=Group" (3353:38319). */
export const Group: Story = { args: { variant: 'Group' } };

/** Figma "Variant=OU" (3353:38803). */
export const OU: Story = { args: { variant: 'OU' } };
