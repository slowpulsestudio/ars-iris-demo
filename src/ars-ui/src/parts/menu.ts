import type { ReactNode } from 'react';
import type { MenuEntry, MenuProps } from '@iris/components/Menu/Menu.js';

/** One row of an ARS menu as Figma draws it, or a separator. */
export type ARSMenuSpec =
  | {
      label: string;
      /** Iris icon name. */
      icon?: string;
      /** Icon artwork for Figma icons that the Iris code icon set doesn't have. */
      visual?: ReactNode;
      danger?: boolean;
      submenu?: ARSMenuSpec[];
    }
  | 'divider';

/** Everything the Iris Menu takes except its items, plus a callback for the picked item. */
export interface ARSMenuProps extends Omit<MenuProps, 'items'> {
  /** Called with the label of the item the user picks. */
  onAction?: (label: string) => void;
}

/** Turns an ARS menu spec into Iris Menu entries. */
export function toMenuEntries(spec: ARSMenuSpec[], onAction?: (label: string) => void): MenuEntry[] {
  return spec.map((row): MenuEntry => {
    if (row === 'divider') return { kind: 'divider' };
    if (row.submenu) {
      return { kind: 'submenu', label: row.label, icon: row.icon, items: toMenuEntries(row.submenu, onAction) };
    }
    return {
      kind: 'item',
      label: row.label,
      icon: row.icon,
      visual: row.visual,
      danger: row.danger,
      onSelect: () => onAction?.(row.label),
    };
  });
}
