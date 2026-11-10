import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const NEW_OBJECT_MENU: ARSMenuSpec[] = [
  { label: 'New AD User', icon: 'WindowsLogo' },
  { label: 'Add User', icon: 'Plus' },
  'divider',
  { label: 'New Group', icon: 'Desktop' },
  'divider',
  { label: 'New Organizational Unit', icon: 'FolderSimplePlus' },
  { label: 'New Group Managed Service Account', icon: 'UserCircle' },
  { label: 'New Shared Folder', icon: 'Folders' },
  { label: 'New Asset', icon: 'Desktop' },
  'divider',
  { label: 'Bulk create', icon: 'Plus' },
  { label: 'Bulk invite', icon: 'Plus' },
  { label: 'Bulk delete', icon: 'Plus' },
];

/** ARS_New Object Menu — new objects for an OU or folder in the tree view. Figma: 3066:57117. */
export function ARSNewObjectMenu({ onAction, ariaLabel = 'New object', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(NEW_OBJECT_MENU, onAction)} />;
}
