import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const FILTER_MENU: ARSMenuSpec[] = [
  { label: 'Display name' },
  { label: 'Object type' },
  { label: 'Tags' },
  { label: 'Location' },
  'divider',
  { label: 'Date active' },
  { label: 'Date created' },
];

/** ARS_Filter_Menu — the fields a table can be filtered by. Figma: 3064:26920. */
export function ARSFilterMenu({ onAction, ariaLabel = 'Filter by', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(FILTER_MENU, onAction)} />;
}
