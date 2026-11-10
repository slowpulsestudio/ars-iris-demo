import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const TABLE_MENU: ARSMenuSpec[] = [
  { label: 'Adjust columns', icon: 'Columns' },
  { label: 'Add columns', icon: 'ColumnsPlusLeft' },
  'divider',
  { label: 'Export', icon: 'Export' },
  'divider',
  { label: 'Ask AI', icon: 'Sparkle' },
];

/** ARS_Table Menu — table settings and actions. Figma: 3663:20381. */
export function ARSTableMenu({ onAction, ariaLabel = 'Table settings', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(TABLE_MENU, onAction)} />;
}
