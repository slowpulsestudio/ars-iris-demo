import { useMemo, useState, type MouseEventHandler, type ReactNode } from 'react';
import { AdvancedFilterBar, AdvancedFilterPanel, type AdvancedFilterBarPill } from '@iris-new';
import { Menu, type MenuEntry } from '../../components/Menu/Menu.js';
import { newCondition, newGroup } from '../../components/Filters/filterModel.js';
import { useFilterModel } from '../../components/Filters/useFilterModel.js';
import { useHashParam } from '../../lib/hashState.js';
import { usePublishDockPanel } from '../../lib/dockPanelStore.js';
import { SAMPLE_LDAP } from '../../lib/sampleLdap.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import {
  completeConditions,
  matchesTree,
  parseApplied,
  parametersFor,
  serializeApplied,
  type FilterFieldDef,
} from '../../lib/advancedFilter.js';

export interface AdvancedFilter<T> {
  /** The items that pass the applied filter (all of them when none is set). */
  filtered: T[];
  /** How many finished conditions are applied: the badge on the filter button. */
  filterCount: number;
  /** For the toolbar's filter button; in Bar mode it opens the menu that adds a filter. */
  onFilter: MouseEventHandler<HTMLElement>;
  /** Panel only: the Panel is open. */
  filterPressed: boolean;
  /** Empties the filter (the Bar's tree, or the Panel's draft). */
  clear: () => void;
  /** Bar only: the applied filter as pills, for under the toolbar. Null while there are none. */
  bar: ReactNode;
  /** Bar only: the menu the filter button opens. Render it once anywhere in the screen. */
  elements: ReactNode;
}

export interface AdvancedFilterOptions {
  /** Bar only: draws each pill another way (the ARS filter tag on Favourites). */
  renderPill?: (pill: AdvancedFilterBarPill) => ReactNode;
  /** Bar only: the pills have no tray of their own, because the screen draws the strip. */
  inlinePills?: boolean;
}

/**
 * The Advanced filter for a list. `panel` docks the Advanced filter Panel beside the list, edits a
 * draft and applies it with "Apply filter"; the applied filter lives in the address (`?filter=`).
 * `bar` (modals) shows the filter as pills under the toolbar, edited live in a popover.
 * Figma: Iris UI Kit "Advanced filter patterns" 332:45.
 */
export function useAdvancedFilter<T>(
  items: T[],
  fields: FilterFieldDef<T>[],
  mode: 'panel' | 'bar' = 'panel',
  options: AdvancedFilterOptions = {},
): AdvancedFilter<T> {
  const [param, setParam] = useHashParam('filter');
  const applied = useMemo(() => (mode === 'panel' ? parseApplied(param) : newGroup('and')), [mode, param]);
  const { root, actions } = useFilterModel(applied);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const menu = useAnchoredMenu();

  const parameters = useMemo(() => parametersFor(fields, items), [fields, items]);
  const categories = useMemo(
    () => [{ label: 'Common', icon: 'IdentificationCard', parameterIds: fields.map((f) => f.id) }],
    [fields],
  );

  // The Panel edits a draft until Apply; the Bar edits the filter itself.
  const tree = mode === 'panel' ? applied : root;
  const conditions = completeConditions(tree);
  const filtered = useMemo(
    () => (conditions.length ? items.filter((item) => matchesTree(tree, item, fields)) : items),
    [items, tree, fields, conditions.length],
  );

  const togglePanel = () => {
    if (!open) actions.replace(applied);
    setOpen(!open);
  };

  usePublishDockPanel(
    mode === 'panel'
      ? {
          open,
          element: (
            <AdvancedFilterPanel
              root={root}
              parameters={parameters}
              categories={categories}
              actions={actions}
              addLabel="Add filter"
              syntaxes={[{ id: 'ldap', label: 'LDAP', code: SAMPLE_LDAP }]}
              onClose={() => setOpen(false)}
              onCancel={() => {
                actions.replace(applied);
                setOpen(false);
              }}
              onApply={() => setParam(serializeApplied(root))}
            />
          ),
        }
      : undefined,
  );

  if (mode === 'panel') {
    return { filtered, filterCount: conditions.length, onFilter: togglePanel, filterPressed: open, clear: actions.clear, bar: null, elements: null };
  }

  // Bar: the filter button offers the Advanced filter and each field; either adds a pill and opens its editor.
  const addCard = (parameterId?: string) => {
    const card = newGroup('and', [newCondition({ parameterId })]);
    actions.replace({ ...root, children: [...root.children, card] });
    setEditingId(card.id);
  };
  const entries: MenuEntry[] = [
    { kind: 'item', label: 'Advanced filter', icon: 'FunnelSimple', onSelect: () => addCard() },
    { kind: 'divider' },
    ...fields.map((f): MenuEntry => ({ kind: 'item', label: f.label, icon: f.icon, onSelect: () => addCard(f.id) })),
  ];

  return {
    filtered,
    filterCount: conditions.length,
    onFilter: menu.openAt,
    filterPressed: false,
    clear: actions.clear,
    bar:
      root.children.length === 0 ? null : (
        <AdvancedFilterBar
          root={root}
          parameters={parameters}
          actions={actions}
          editingId={editingId}
          onEditingIdChange={setEditingId}
          renderPill={options.renderPill}
          inline={options.inlinePills}
        />
      ),
    elements: <Menu {...menu.menuProps} items={entries} ariaLabel="Add filter" />,
  };
}
