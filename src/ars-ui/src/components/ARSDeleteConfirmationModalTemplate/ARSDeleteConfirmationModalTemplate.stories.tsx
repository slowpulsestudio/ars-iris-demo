import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@iris/components/Button/Button.js';
import { ARSDeleteConfirmationModalTemplate } from './ARSDeleteConfirmationModalTemplate.js';

const meta = {
  title: 'ARS/ARS_Delete_Confirmation_Modal_Template',
  component: ARSDeleteConfirmationModalTemplate,
  parameters: {
    docs: {
      description: {
        component:
          'Figma: ARS_Delete_Confirmation_Modal_Template · ARS - Primary · 2385:59716. Figma\'s "Delete Object" piece is a UI Kit modal (S, 380px), so this is the Iris Modal: warning icon, Iris FormField + TextInput, Cancel and the danger Delete button.',
      },
      story: { inline: false, iframeHeight: 420 },
    },
  },
  args: { open: true, onClose: () => {} },
} satisfies Meta<typeof ARSDeleteConfirmationModalTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open
        </Button>
        <ARSDeleteConfirmationModalTemplate {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
};
