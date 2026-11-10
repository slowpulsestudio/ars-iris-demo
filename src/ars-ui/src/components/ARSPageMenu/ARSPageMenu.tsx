import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const PAGE_MENU: ARSMenuSpec[] = [
  { label: 'Customize', icon: 'PencilSimple' },
  'divider',
  { label: 'Add to Favorites', icon: 'Star' },
  { label: 'Download view as .CSV', icon: 'DownloadSimple' },
  'divider',
  { label: 'Ask AI', icon: 'Sparkle' },
];

/** ARS_Page Menu — page-level actions behind the header's "..." button. Figma: 3663:20458. */
export function ARSPageMenu({ onAction, ariaLabel = 'Page actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(PAGE_MENU, onAction)} />;
}
