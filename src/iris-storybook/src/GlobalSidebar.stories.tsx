import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  GlobalSidebar,
  type GlobalSidebarProps,
} from '@iris/components/GlobalSidebar/GlobalSidebar.js';
import { UsersProvider } from '@iris/lib/usersStore.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DEFAULT_PERSONA } from '@iris/lib/personas.js';
import { IDENTITY_NAV_GROUPS, identitySectionHash } from '@iris/lib/identityNav.js';

// An Identity Manager page inside the "My access" group.
const REQUEST_ACCESS_ROUTE = identitySectionHash('my-access', 'request-access');

// Picks the persona the way the welcome page does, then shows the chrome.
function SignedIn({ children }: { children: ReactNode }) {
  const { persona, setPersonaId } = useAppShell();
  useEffect(() => {
    setPersonaId(DEFAULT_PERSONA.id);
  }, [setPersonaId]);
  return persona?.id === DEFAULT_PERSONA.id ? children : null;
}

function GlobalSidebarDemo(args: GlobalSidebarProps) {
  const [activeItem, setActiveItem] = useState(args.activeItem);
  return <GlobalSidebar {...args} activeItem={activeItem} onItemChange={setActiveItem} />;
}

const meta = {
  title: 'Iris/GlobalSidebar',
  component: GlobalSidebar,
  parameters: {
    layout: 'fullscreen',
    // Address the story opens at; the sidebar reads the current product from it.
    route: '#/users',
    docs: { description: { component: 'Full-height product navigation panel, either pinned beside the content or peeking over it as an overlay. Iris code: src/iris-shell/src/components/GlobalSidebar.' } },
  },
  // Open the story at its route like a deep link, and put the previous address back afterwards.
  beforeEach: ({ parameters }) => {
    const previous = window.location.hash;
    window.history.replaceState(null, '', parameters.route);
    return () => {
      window.history.replaceState(null, '', previous || `${window.location.pathname}${window.location.search}`);
    };
  },
  decorators: [
    (Story) => (
      <UsersProvider>
        <DirectoryProvider>
          <AppShellProvider>
            <SignedIn>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  height: 640,
                  overflow: 'hidden',
                  backgroundColor: 'var(--oi-background-color-secondary)',
                }}
              >
                <Story />
              </div>
            </SignedIn>
          </AppShellProvider>
        </DirectoryProvider>
      </UsersProvider>
    ),
  ],
  args: { open: true, mode: 'pinned', activeItem: 'directory' },
  argTypes: { mode: { control: 'inline-radio', options: ['pinned', 'peek'] } },
  render: (args) => <GlobalSidebarDemo key={args.activeItem} {...args} />,
} satisfies Meta<typeof GlobalSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveItem: Story = {
  name: 'Active item',
  parameters: {
    route: '#/insights',
    docs: { description: { story: 'Insights is the current page.' } },
  },
  args: { activeItem: 'insights' },
};

export const Collapsed: Story = {
  parameters: {
    docs: { description: { story: 'Pinned mode with the panel closed shrinks it to no width, which is how the app starts. Turn on open to watch it expand.' } },
  },
  args: { open: false },
};

export const Peek: Story = {
  parameters: {
    docs: { description: { story: 'Floats over the page below the header, without its own product header, as when the pointer rests on the header’s sidebar button while the sidebar is collapsed.' } },
  },
  args: { mode: 'peek' },
};

export const GroupedNavigation: Story = {
  name: 'Grouped navigation',
  parameters: {
    route: REQUEST_ACCESS_ROUTE,
    docs: { description: { story: 'Identity Manager adds collapsible groups (here every group, as in the All review mode). The group holding the current page opens automatically.' } },
  },
  args: { activeItem: REQUEST_ACCESS_ROUTE, navGroups: IDENTITY_NAV_GROUPS },
};
