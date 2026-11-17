import type { Ref } from 'react';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { columnOrder, type ARSColumnSettings } from './columnSettings.js';

export interface ColumnSettingsMenuProps {
  /** The table's own columns, in order; the first can't be hidden or moved. */
  own: readonly string[];
  settings: ARSColumnSettings;
}

/**
 * The table settings button in the right-most column head (ARS_Table_Config 3663:19416) and its menu. At the
 * designer's request the menu starts with Edit width, a toggle (off by default) that lets the column edges be dragged,
 * then lists every column, in the order they show, with a checkbox and a drag handle to move it (Alt+Up and Alt+Down
 * from the keyboard); it stays open while columns are ticked or moved. The first column always shows and stays first,
 * and Actions, the column this menu sits in, always shows and stays last. ARS_Table Menu (3663:20381) has Adjust
 * columns and Add columns entries instead.
 */
export function ColumnSettingsMenu({ own, settings }: ColumnSettingsMenuProps) {
  const columns = columnOrder(own, settings);
  const lead: MenuEntry[] = [
    { kind: 'toggle', label: 'Edit width', checked: settings.editWidth, onChange: settings.onEditWidthChange },
    { kind: 'divider' },
  ];
  const items: MenuEntry[] = [
    ...lead,
    ...columns.map<MenuEntry>((label, i) => ({
      kind: 'checkbox',
      label,
      checked: own.includes(label) ? !settings.hidden.includes(label) : settings.added.includes(label),
      disabled: i === 0,
      movable: i > 0,
      onChange: (checked: boolean) => settings.onToggleColumn(label, checked),
    })),
    { kind: 'checkbox', label: 'Actions', checked: true, disabled: true, onChange: () => {} },
  ];

  // The menu counts its entries; the columns start after the lead ones.
  const move = (from: number, to: number) => {
    const next = [...columns];
    const [label] = next.splice(from - lead.length, 1);
    next.splice(to - lead.length, 0, label);
    settings.onReorder(next);
  };

  return (
    <Menu
      align="end"
      ariaLabel="Table settings"
      items={items}
      onMove={move}
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
