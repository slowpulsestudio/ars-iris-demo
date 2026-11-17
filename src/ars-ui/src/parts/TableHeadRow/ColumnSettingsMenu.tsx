import type { Ref } from 'react';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import type { ARSColumnSettings } from './columnSettings.js';

export interface ColumnSettingsMenuProps {
  /** The table's own columns, in order; the first can't be hidden. */
  own: readonly string[];
  settings: ARSColumnSettings;
}

/**
 * The table settings button in the right-most column head (ARS_Table_Config 3663:19416) and its menu, the first two
 * entries of ARS_Table Menu (3663:20381), working as on the reference Users list: Adjust columns turns resizing on and
 * shows as selected; Add columns lists every column with a checkbox and stays open while they are ticked.
 */
export function ColumnSettingsMenu({ own, settings }: ColumnSettingsMenuProps) {
  const items: MenuEntry[] = [
    {
      kind: 'item',
      label: 'Adjust columns',
      icon: 'Columns',
      selected: settings.adjusting,
      onSelect: () => settings.onAdjustingChange(!settings.adjusting),
    },
    {
      kind: 'submenu',
      label: 'Add columns',
      icon: 'ColumnsPlusLeft',
      items: [...own, ...settings.extra].map((label) => ({
        kind: 'checkbox' as const,
        label,
        checked: own.includes(label) ? !settings.hidden.includes(label) : settings.added.includes(label),
        disabled: label === own[0],
        onChange: (checked: boolean) => settings.onToggleColumn(label, checked),
      })),
    },
  ];

  return (
    <Menu
      align="end"
      ariaLabel="Table settings"
      items={items}
      trigger={({ ref, onClick, expanded }) => (
        <IconButton
          ref={ref as Ref<HTMLButtonElement>}
          icon="SlidersHorizontal"
          ariaLabel="Table settings"
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={onClick}
        />
      )}
    />
  );
}
