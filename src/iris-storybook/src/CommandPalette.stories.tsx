import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommandPalette } from '@iris/components/CommandPalette/CommandPalette.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { UsersProvider } from '@iris/lib/usersStore.js';

// Opens the palette through the shell state, as the header Search button does.
function CommandPaletteDemo() {
  const { setSearchOpen } = useAppShell();

  useEffect(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return <CommandPalette />;
}

const meta = {
  title: 'Iris/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Global search panel that opens with ⌘K. Iris code: src/iris-shell/src/components/CommandPalette.' } },
  },
  decorators: [
    (Story) => (
      <UsersProvider>
        <DirectoryProvider>
          <AppShellProvider>
            <div style={{ height: 720, backgroundColor: 'var(--oi-background-color-secondary)' }}>
              <Story />
            </div>
          </AppShellProvider>
        </DirectoryProvider>
      </UsersProvider>
    ),
  ],
  render: () => <CommandPaletteDemo />,
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
