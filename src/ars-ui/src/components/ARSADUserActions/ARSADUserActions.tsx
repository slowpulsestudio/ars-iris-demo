import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const AD_USER_ACTIONS: ARSMenuSpec[] = [
  { label: 'Reset Password', icon: 'Password' },
  { label: 'Copy', icon: 'Copy' },
  { label: 'Move', icon: 'VectorThree' },
  { label: 'Properties', icon: 'Gear' },
  { label: 'Add to Favorites', icon: 'Star' },
  'divider',
  { label: 'Connections', icon: 'Plug' },
  { label: 'Managed Units', icon: 'Gear' },
  { label: 'Memberships', icon: 'UsersThree' },
  { label: 'Roles', icon: 'Briefcase' },
  'divider',
  { label: 'Deprovision', icon: 'Prohibit', danger: true },
  { label: 'Deactivate', icon: 'XCircle', danger: true },
  { label: 'Delete', icon: 'Trash', danger: true },
];

/** ARS_AD User Actions — the actions menu for one Active Directory user. Figma: 2275:90709. */
export function ARSADUserActions({ onAction, ariaLabel = 'User actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(AD_USER_ACTIONS, onAction)} />;
}
