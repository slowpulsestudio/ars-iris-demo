import { useEffect, useState, type ReactNode, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AppHeader,
  type AppHeaderProps,
  type Crumb,
  type HeaderUser,
} from '@iris/components/AppHeader/AppHeader.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Menu } from '@iris/components/Menu/Menu.js';
import { UsersProvider } from '@iris/lib/usersStore.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DEFAULT_PERSONA } from '@iris/lib/personas.js';
import { IDENTITY_ROLES } from '@iris/lib/identityNav.js';
import { MOCK_USERS } from '@iris/views/UsersPage/mockUsers.js';

// AppShell shows the signed-in persona as the header user.
const SIGNED_IN_USER: HeaderUser = {
  name: DEFAULT_PERSONA.name,
  src: DEFAULT_PERSONA.avatar,
  email: DEFAULT_PERSONA.email,
};

// Crumbs from the Users page and a user's detail page.
const USERS_BREADCRUMB: Crumb[] = [{ label: 'Directory Management' }, { label: 'Users' }];

const USER_DETAIL_BREADCRUMB: Crumb[] = [
  { label: 'Directory Management' },
  { label: 'Users', onClick: () => {} },
  { label: MOCK_USERS[0].name },
];

// Picks the persona the way the welcome page does, then shows the chrome.
function SignedIn({ children }: { children: ReactNode }) {
  const { persona, setPersonaId } = useAppShell();
  useEffect(() => {
    setPersonaId(DEFAULT_PERSONA.id);
  }, [setPersonaId]);
  return persona?.id === DEFAULT_PERSONA.id ? children : null;
}

// The "Preview as" switcher AppShell passes on Identity Manager pages.
function RoleSwitcher() {
  const { identityRole, setIdentityRole } = useAppShell();
  const activeRoleLabel =
    IDENTITY_ROLES.find((r) => r.id === identityRole)?.label ?? IDENTITY_ROLES[0].label;
  return (
    <Menu
      ariaLabel="Preview as role"
      align="end"
      items={IDENTITY_ROLES.map((r) => ({
        kind: 'item',
        label: r.label,
        icon: r.icon,
        selected: r.id === identityRole,
        onSelect: () => setIdentityRole(r.id),
      }))}
      trigger={({ ref, onClick, expanded }) => (
        <IconButton
          ref={ref as Ref<HTMLButtonElement>}
          icon="UserSwitch"
          ariaLabel={`Preview as: ${activeRoleLabel}`}
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={onClick}
        />
      )}
    />
  );
}

function AppHeaderDemo(args: AppHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(args.sidebarOpen);
  const [aiActive, setAiActive] = useState(args.aiActive);
  return (
    <AppHeader
      {...args}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((open) => !open)}
      aiActive={aiActive}
      onAskAi={() => setAiActive((active) => !active)}
    />
  );
}

const meta = {
  title: 'Iris/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    // Address the story opens at; the header reads the current product from it.
    route: '#/users',
    docs: { description: { component: 'Top bar with the product chooser, breadcrumb, search, notifications, Ask AI button and user avatar, whose profile menu holds the theme switcher. Iris code: src/iris-shell/src/components/AppHeader.' } },
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
                  flexDirection: 'column',
                  height: 480,
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
    breadcrumb: USERS_BREADCRUMB,
    user: SIGNED_IN_USER,
    sidebarOpen: false,
    aiActive: false,
    onSignOut: () => {},
  },
  argTypes: { roleSwitcher: { control: false } },
  render: (args) => <AppHeaderDemo key={`${args.sidebarOpen}-${args.aiActive}`} {...args} />,
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SidebarCollapsed: Story = {
  name: 'Sidebar collapsed',
  parameters: {
    docs: { description: { story: 'The global sidebar is hidden, so the header shows the product chooser and an Expand sidebar button.' } },
  },
  args: { sidebarOpen: false },
};

export const SidebarExpanded: Story = {
  name: 'Sidebar expanded',
  parameters: {
    docs: { description: { story: 'The global sidebar is pinned open and shows the logo, so the header hides its product chooser and shows a Collapse sidebar button.' } },
  },
  args: { sidebarOpen: true },
};

export const WithBreadcrumb: Story = {
  name: 'With breadcrumb',
  parameters: {
    route: `#/users/${MOCK_USERS[0].id}`,
    docs: { description: { story: 'A deeper trail, as on a user’s detail page. Crumbs with a click action show as links; the last crumb is the current page.' } },
  },
  args: { breadcrumb: USER_DETAIL_BREADCRUMB },
};

export const AskAiPanelOpen: Story = {
  name: 'Ask AI panel open',
  parameters: {
    docs: { description: { story: 'While the Ask AI panel is open, the Ask AI button drops its moving border highlight.' } },
  },
  args: { aiActive: true },
};

export const WithRoleSwitcher: Story = {
  name: 'With role switcher',
  parameters: {
    route: '#/identity',
    docs: { description: { story: 'Identity Manager pages add the “Preview as” role switcher before Search.' } },
  },
  args: { breadcrumb: [{ label: 'Account home' }], roleSwitcher: <RoleSwitcher /> },
};

export const SignOutUnavailable: Story = {
  name: 'Sign out unavailable',
  parameters: {
    docs: { description: { story: 'Without a sign-out action, Sign out in the user menu is shown but inactive. Open the user menu to see it.' } },
  },
  args: { onSignOut: undefined },
};
