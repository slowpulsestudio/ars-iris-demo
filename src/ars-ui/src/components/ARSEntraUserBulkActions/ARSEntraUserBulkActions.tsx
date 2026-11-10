import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

export const ENTRA_USER_BULK_ACTIONS: ARSMenuSpec[] = [
  { label: 'Create', icon: 'Plus' },
  { label: 'Invite', icon: 'EnvelopeSimpleOpen' },
  'divider',
  { label: 'Delete', icon: 'Trash', danger: true },
];

/** Entra User Bulk Actions — actions for several selected Entra ID users. Figma: 2275:91260. */
export function ARSEntraUserBulkActions({ onAction, ariaLabel = 'Bulk user actions', ...props }: ARSMenuProps) {
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(ENTRA_USER_BULK_ACTIONS, onAction)} />;
}
