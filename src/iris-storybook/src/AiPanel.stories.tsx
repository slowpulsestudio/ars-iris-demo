import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiPanel, type AiPanelProps } from '@iris/components/AiPanel/AiPanel.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { UsersProvider, useUsers } from '@iris/lib/usersStore.js';
import { SUGGESTED_PROMPTS } from '@iris/lib/aiPrompts.js';

interface AiPanelDemoProps extends AiPanelProps {
  /** Attach the first three directory users, as the Users page Ask AI action does. */
  withUserContext?: boolean;
  /** Fill in the message box without sending, as the Identity Manager Home suggestion pills do. */
  pendingPrompt?: string;
}

// Binds the panel to the shell state the same way AppShell does.
function AiPanelDemo({ withUserContext = false, pendingPrompt, ...args }: AiPanelDemoProps) {
  const { aiOpen, setAiOpen, setAiContext, setPendingAiPrompt } = useAppShell();
  const { users } = useUsers();

  useEffect(() => {
    if (withUserContext) {
      setAiContext(users.slice(0, 3).map((u) => ({ kind: 'user' as const, id: u.id, label: u.name })));
    }
    if (pendingPrompt) setPendingAiPrompt(pendingPrompt);
  }, [withUserContext, pendingPrompt, users, setAiContext, setPendingAiPrompt]);

  useEffect(() => {
    setAiOpen(args.open);
  }, [args.open, setAiOpen]);

  return <AiPanel {...args} open={aiOpen} onClose={() => setAiOpen(false)} />;
}

const meta = {
  title: 'Iris/AiPanel',
  component: AiPanel,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Inline Ask AI chat panel that docks to the right of the main content area. Iris code: src/iris-shell/src/components/AiPanel.' } },
  },
  decorators: [
    (Story) => (
      <UsersProvider>
        <DirectoryProvider>
          <AppShellProvider>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                height: 720,
                padding: 'var(--oi-spacing-s)',
                backgroundColor: 'var(--oi-background-color-secondary)',
              }}
            >
              <Story />
            </div>
          </AppShellProvider>
        </DirectoryProvider>
      </UsersProvider>
    ),
  ],
  args: { open: true, onClose: () => {} },
  render: (args) => <AiPanelDemo {...args} />,
} satisfies Meta<typeof AiPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPageContext: Story = {
  name: 'With page context',
  parameters: {
    docs: { description: { story: 'Opened with three selected users attached, the way the Users page Ask AI action opens it.' } },
  },
  render: (args) => <AiPanelDemo {...args} withUserContext />,
};

export const WithPendingPrompt: Story = {
  name: 'With pending prompt',
  parameters: {
    docs: { description: { story: 'Opened with the message box filled in but not sent, the way the Identity Manager Home suggestion pills open it.' } },
  },
  render: (args) => <AiPanelDemo {...args} pendingPrompt={SUGGESTED_PROMPTS[0].prompt} />,
};
