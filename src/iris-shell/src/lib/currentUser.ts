import type { HeaderUser } from '../components/AppHeader/AppHeader.js';
import { useAppShell } from './appShellContext.js';
import { DEFAULT_PERSONA } from './personas.js';

/**
 * Signed-in user: the persona picked on the welcome page. Single source of
 * truth for every AppShell instance (header avatar + user menu).
 */
export function useCurrentUser(): HeaderUser {
  const persona = useAppShell().persona ?? DEFAULT_PERSONA;
  return { name: persona.name, src: persona.avatar, email: persona.email };
}
