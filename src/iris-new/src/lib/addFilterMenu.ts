import type { MenuEntry } from '@iris/components/Menu/Menu.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { ParameterDef } from '@iris/components/Filters/filterModel.js';

/**
 * The "Add filter" menu: "Add filter group", then each property group as a submenu of its fields, listed
 * without icons. Figma: ARS_WebUI2_Advanced-Search "Add filter dropdown" 4145:57189 and "Common property
 * dropdown" 4145:57197.
 */
export function addFilterMenu(
  parameters: ParameterDef[],
  categories: ParamCategory[],
  onAddCondition: (parameterId: string) => void,
  onAddGroup?: () => void,
): MenuEntry[] {
  const byId = new Map(parameters.map((p) => [p.id, p]));
  const groups: MenuEntry[] = categories.map((cat) => ({
    kind: 'submenu',
    label: cat.label,
    icon: cat.icon,
    items: cat.parameterIds
      .map((id) => byId.get(id))
      .filter((p): p is ParameterDef => Boolean(p))
      .map((p): MenuEntry => ({ kind: 'item', label: p.label, onSelect: () => onAddCondition(p.id) })),
  }));
  return onAddGroup
    ? [{ kind: 'item', label: 'Add filter group', icon: 'FunnelSimple', onSelect: onAddGroup }, { kind: 'divider' }, ...groups]
    : groups;
}
