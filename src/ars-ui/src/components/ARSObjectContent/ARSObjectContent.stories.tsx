import type { Meta, StoryObj } from '@storybook/react-vite';
import { ARSObjectContent } from './ARSObjectContent.js';

const meta = {
  title: 'ARS/ARS_Object_Content',
  component: ARSObjectContent,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: ARS_Object_Content · ARS - Primary · 2385:56718. Figma's Properties card here comes from outside this file, so its rows differ from ARS_users_Properties Card. Figma shows Variant3 scrolled inside a 593px frame; here it's shown at full height.",
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['General', 'Variant3'] } },
  decorators: [(Story) => <div style={{ maxWidth: 977 }}><Story /></div>],
} satisfies Meta<typeof ARSObjectContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Variant=General" (2493:30182). */
export const General: Story = { args: { variant: 'General' } };

/** Figma "Variant=Variant3" (2654:24986): the User Details tab. */
export const Variant3: Story = { args: { variant: 'Variant3' } };

/** No Object Management, so the tab content is full width: the Groups file's Memberships tab (ARS_WebUI2_Groups 167:6877). */
export const WithoutObjectManagement: Story = {
  name: 'Without Object Management',
  args: { variant: 'General', hideActions: true },
};
