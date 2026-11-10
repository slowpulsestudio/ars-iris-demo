import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const CREATE_MENU: ARSMenuSpec[] = [
  { label: 'User', icon: 'User' },
  { label: 'Group', icon: 'UsersThree' },
  'divider',
  { label: 'Computer', icon: 'Devices' },
  'divider',
  { label: 'Organizational unit', icon: 'FolderPlus' },
  { label: 'Shared folder', icon: 'Folders' },
  'divider',
  { label: 'Contact', icon: 'AddressBook' },
  { label: 'Group Managed Service Account', icon: 'UserCircle' },
];

/** Create menu — the object types the Create button can make. Figma: 3360:40902. */
export function ARSCreateMenu({ onAction, ariaLabel = 'Create', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(CREATE_MENU, onAction)} />;
}
