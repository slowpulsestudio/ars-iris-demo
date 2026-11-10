import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const AD_BULK_USER_FLAT_VIEW: ARSMenuSpec[] = [
  { label: 'Assign role', icon: 'UserGear' },
  { label: 'Add to group', icon: 'UsersThree' },
  // Figma has two Iris placeholder rows here, shown as drawn.
  { label: 'Menu item', icon: 'DiamondsFour' },
  'divider',
  { label: 'Menu item', icon: 'DiamondsFour' },
];

/** ARS_AD Bulk User Flat View — actions for several users selected in the flat view. Figma: 2385:57426. */
export function ARSADBulkUserFlatView({ onAction, ariaLabel = 'Bulk user actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(AD_BULK_USER_FLAT_VIEW, onAction)} />;
}
