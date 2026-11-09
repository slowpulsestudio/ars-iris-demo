import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, type SidebarProps } from '@iris/components/Sidebar/Sidebar.js';
import { Tree } from '@iris/components/Sidebar/Tree.js';
import { UsersProvider } from '@iris/lib/usersStore.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DEFAULT_PERSONA } from '@iris/lib/personas.js';
import { ACTIVE_ROLES_VERTICAL } from '@iris/lib/verticals.js';

// The directory panel AppShell shows for the signed-in persona in Active Roles.
const DIRECTORY_PANEL = ACTIVE_ROLES_VERTICAL.secondarySidebar;

// Picks the persona the way the welcome page does, then shows the chrome.
function SignedIn({ children }: { children: ReactNode }) {
  const { persona, setPersonaId } = useAppShell();
  useEffect(() => {
    setPersonaId(DEFAULT_PERSONA.id);
  }, [setPersonaId]);
  return persona?.id === DEFAULT_PERSONA.id ? children : null;
}

function SidebarDemo(args: SidebarProps) {
  const [view, setView] = useState(args.view);
  const [activeNav, setActiveNav] = useState(args.activeNav);
  return (
    <Sidebar
      {...args}
      view={view}
      onViewChange={setView}
      activeNav={activeNav}
      onNavChange={setActiveNav}
    />
  );
}

const meta = {
  title: 'Iris/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    // Address the story opens at; the tree reads its selected node from it.
    route: '#/users',
    docs: { description: { component: 'Directory navigation rail with Flat view, Tree view and Favourites. Iris code: src/iris-shell/src/components/Sidebar.' } },
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
                  display: 'flex',
                  height: 640,
                  padding: 'var(--oi-spacing-s)',
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
  args: {
    navItems: DIRECTORY_PANEL.navItems,
    activeNav: 'users',
    directoryLabel: DIRECTORY_PANEL.directoryLabel,
    view: 'flat',
    onViewChange: () => {},
  },
  argTypes: { view: { control: 'inline-radio', options: ['flat', 'tree', 'favourites'] } },
  render: (args) => <SidebarDemo key={`${args.view}-${args.activeNav}`} {...args} />,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TreeView: Story = {
  name: 'Tree view',
  parameters: {
    route: '#/tree',
    docs: { description: { story: 'The directory tree as the Tree view page opens it, with the first node selected. Click a node to select it.' } },
  },
  args: { view: 'tree', activeNav: '' },
};

export const FavouritesView: Story = {
  name: 'Favourites view',
  parameters: {
    route: '#/favorites',
    docs: { description: { story: 'Lists objects added to favourites elsewhere in the app. Nothing has been added in Storybook, so it shows the empty message.' } },
  },
  args: { view: 'favourites', activeNav: '' },
};

export const WithResizeHandle: Story = {
  name: 'With resize handle',
  parameters: {
    docs: { description: { story: 'A drag action adds a resize handle on the right edge; hover it to see its line and tooltip. AppShell does the resizing, so dragging does nothing here.' } },
  },
  args: { onResizePointerDown: () => {} },
};

export const Dragging: Story = {
  parameters: {
    docs: { description: { story: 'The resize handle while the rail is being dragged.' } },
  },
  args: { onResizePointerDown: () => {}, dragging: true },
};

export const DirectoryTree: Story = {
  name: 'Tree',
  parameters: {
    route: '#/tree',
    controls: { disable: true },
    docs: { description: { story: 'The directory tree on its own, as the Tree view shows it. Click a node to select it, or right-click it for its actions. Iris code: src/iris-shell/src/components/Sidebar/Tree.tsx.' } },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'max-content',
        backgroundColor: 'var(--oi-background-color-primary)',
        border: 'var(--oi-border-width-default) var(--oi-border-style-solid) var(--oi-border-color-muted)',
        borderRadius: 'var(--oi-border-radius-l)',
        overflow: 'hidden',
      }}
    >
      <Tree />
    </div>
  ),
};
