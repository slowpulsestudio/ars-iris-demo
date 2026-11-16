import { Menu } from '@iris/components/Menu/Menu.js';
import { FolderArrowRightIcon } from '../../parts/FolderArrowRightIcon.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';
import { NEW_OBJECT_MENU } from '../ARSNewObjectMenu/ARSNewObjectMenu.js';

export const AD_RIGHT_CLICK_TREE_MENU: ARSMenuSpec[] = [
  // Figma draws Create with a submenu arrow; "New object from Tree View OU/Folder AD" is ARS_New Object Menu.
  { label: 'Create', icon: 'Plus', submenu: NEW_OBJECT_MENU },
  { label: 'View properties', icon: 'Eye' },
  { label: 'Move', visual: <FolderArrowRightIcon /> },
  { label: 'Add to Favorites', icon: 'Star' },
  'divider',
  { label: 'Delete', icon: 'Trash', danger: true },
];

/** ARS_AD Right Click Tree Menu — opens where an OU or folder in the tree is right-clicked. Figma: 2385:57427. */
export interface ARSADRightClickTreeMenuProps extends ARSMenuProps {
  /** The object is in Entra, which has no location: Move is left out. */
  entra?: boolean;
}

export function ARSADRightClickTreeMenu({ onAction, entra = false, ariaLabel = 'Folder actions', ...props }: ARSADRightClickTreeMenuProps) {
  const spec = entra ? AD_RIGHT_CLICK_TREE_MENU.filter((row) => row === 'divider' || row.label !== 'Move') : AD_RIGHT_CLICK_TREE_MENU;
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(spec, onAction)} />;
}
