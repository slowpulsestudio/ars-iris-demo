import { Menu } from '@iris/components/Menu/Menu.js';
import { toMenuEntries, type ARSMenuProps, type ARSMenuSpec } from '../../parts/menu.js';

/** A group's actions as the written requirements list them ("Object Actions"), with the AD user menu's icons. */
export const GROUP_ACTIONS: ARSMenuSpec[] = [
  { label: 'Properties', icon: 'Gear' },
  { label: 'Rename', icon: 'PencilSimple' },
  { label: 'Move', icon: 'VectorThree' },
  { label: 'Copy', icon: 'Copy' },
  'divider',
  { label: 'Deprovision', icon: 'Prohibit', danger: true },
  { label: 'Delete', icon: 'Trash', danger: true },
];

export interface ARSGroupActionsProps extends ARSMenuProps {
  /** An Entra group: the requirements board lists no Move for Entra groups (531:1408). */
  entra?: boolean;
}

/**
 * ARS_Group Actions — the actions menu for one group, opened from a row's "…" in the Groups list. Missing from
 * Figma: only written requirements, "Object Actions" in ARS_WebUI2_Groups (64:6801) and the requirements board
 * (AD group 453:2930; Entra group 531:1408, without Move).
 */
export function ARSGroupActions({ onAction, entra = false, ariaLabel = 'Group actions', ...props }: ARSGroupActionsProps) {
  const items = entra ? GROUP_ACTIONS.filter((row) => row === 'divider' || row.label !== 'Move') : GROUP_ACTIONS;
  return <Menu {...props} ariaLabel={ariaLabel} items={toMenuEntries(items, onAction)} />;
}
