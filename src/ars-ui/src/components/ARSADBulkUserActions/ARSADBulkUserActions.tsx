import { Menu } from '@iris/components/Menu/Menu.js';
import { FolderArrowRightIcon } from '../../parts/FolderArrowRightIcon.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const AD_BULK_USER_ACTIONS: ARSMenuSpec[] = [
  { label: 'Reset Password', icon: 'Password' },
  { label: 'Copy', icon: 'Copy' },
  'divider',
  { label: 'Move', visual: <FolderArrowRightIcon /> },
  'divider',
  { label: 'Bulk Deprovision', icon: 'Trash', danger: true },
];

/** ARS_AD Bulk User Actions — actions for several selected Active Directory users. Figma: 2385:57425. */
export function ARSADBulkUserActions({ onAction, ariaLabel = 'Bulk user actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(AD_BULK_USER_ACTIONS, onAction)} />;
}
