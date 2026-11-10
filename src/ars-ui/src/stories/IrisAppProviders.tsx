import { useEffect, type ReactNode } from 'react';
import { UsersProvider } from '@iris/lib/usersStore.js';
import { DirectoryProvider } from '@iris/lib/directoryStore.js';
import { AppShellProvider, useAppShell } from '@iris/lib/appShellContext.js';
import { DEFAULT_PERSONA } from '@iris/lib/personas.js';
import type { HeaderUser } from '@iris/components/AppHeader/AppHeader.js';

/** The signed-in persona as the AppHeader user, as in the Iris AppHeader story. */
export const signedInUser: HeaderUser = {
  name: DEFAULT_PERSONA.name,
  src: DEFAULT_PERSONA.avatar,
  email: DEFAULT_PERSONA.email,
};

// Picks the persona the way the welcome page does, then shows the children.
function SignedIn({ children }: { children: ReactNode }) {
  const { persona, setPersonaId } = useAppShell();
  useEffect(() => {
    setPersonaId(DEFAULT_PERSONA.id);
  }, [setPersonaId]);
  return persona?.id === DEFAULT_PERSONA.id ? children : null;
}

/** The app providers Iris shell chrome (GlobalSidebar, AppHeader) needs in a story. */
export function IrisAppProviders({ children }: { children: ReactNode }) {
  return (
    <UsersProvider>
      <DirectoryProvider>
        <AppShellProvider>
          <SignedIn>{children}</SignedIn>
        </AppShellProvider>
      </DirectoryProvider>
    </UsersProvider>
  );
}

/** Opens a story at an app route (the chrome reads the product from it), then restores the address. */
export function withRoute(route: string) {
  const previous = window.location.hash;
  window.history.replaceState(null, '', route);
  return () => {
    window.history.replaceState(null, '', previous || `${window.location.pathname}${window.location.search}`);
  };
}
