import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export type ARSNewUserEntraDirVariant = 'Entra Only' | 'AD Only' | 'Variant3';

export const NEW_USER_ENTRA_DIR_MENU: Record<ARSNewUserEntraDirVariant, ARSMenuSpec[]> = {
  'Entra Only': [
    { label: 'New Entra User', icon: 'WindowsLogo' },
    { label: 'Add User', icon: 'Plus' },
  ],
  'AD Only': [
    { label: 'New AD User', icon: 'WindowsLogo' },
    { label: 'Add User', icon: 'Plus' },
  ],
  Variant3: [
    { label: 'New Entra User', icon: 'WindowsLogo' },
    { label: 'New AD User', icon: 'WindowsLogo' },
    { label: 'Add User', icon: 'Plus' },
  ],
};

export interface ARSNewUserEntraDirProps extends ARSMenuProps {
  /** Figma variant: which directories the new user can go in. */
  variant?: ARSNewUserEntraDirVariant;
}

/** ARS_New User Entra Dir — the new-user choices for Entra, AD, or both. Figma: 2275:91121. */
export function ARSNewUserEntraDir({
  variant = 'Entra Only',
  onAction,
  ariaLabel = 'New user',
  ...props
}: ARSNewUserEntraDirProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(NEW_USER_ENTRA_DIR_MENU[variant], onAction)} />;
}
