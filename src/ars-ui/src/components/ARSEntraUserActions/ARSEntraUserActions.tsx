import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const ENTRA_USER_ACTIONS: ARSMenuSpec[] = [
  { label: 'Reset Password', icon: 'Password' },
  'divider',
  { label: 'Properties', icon: 'Gear' },
  'divider',
  { label: 'Deprovision', icon: 'Prohibit', danger: true },
  { label: 'Deactivate', icon: 'XCircle', danger: true },
  { label: 'Revoke Sessions', icon: 'Trash', danger: true },
];

/** ARS_Entra User Actions — the actions menu for one Entra ID user. Figma: 2275:90868. */
export function ARSEntraUserActions({ onAction, ariaLabel = 'User actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(ENTRA_USER_ACTIONS, onAction)} />;
}
