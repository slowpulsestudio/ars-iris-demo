import { useMemo, useState, type MouseEventHandler, type ReactNode } from 'react';
import {
  AdvancedFilterBar,
  AdvancedFilterPanel,
  addFilterMenu,
  toLdap,
  type AdvancedFilterBarEditing,
  type AdvancedFilterBarPill,
} from '@iris-new';
import { Menu } from '../../components/Menu/Menu.js';
import { defaultOperatorFor, newCondition, newGroup } from '../../components/Filters/filterModel.js';
import { useFilterModel } from '../../components/Filters/useFilterModel.js';
import { useHashParam } from '../../lib/hashState.js';
import { usePublishDockPanel } from '../../lib/dockPanelStore.js';
import { splitPersonaHash } from '../../lib/router.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { NoFilterResults } from '../NoFilterResults/NoFilterResults.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import {
  FILTERS_GUIDE_URL,
  LDAP_ATTRIBUTES,
  categoriesFor,
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
  /** Empties the filter: the Bar's tree, or the Panel's draft and applied filter. */
  clear: () => void;
  /** The empty state for a list with `count` rows left: shown when a filter is applied and nothing matches, else undefined. */
  emptyWhen: (count: number) => ReactNode;
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
  /** Panel only: the name the list is saved under as a view in Favourites, e.g. "Users". */
  viewName?: string;
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
  const [editing, setEditing] = useState<AdvancedFilterBarEditing | null>(null);
  const menu = useAnchoredMenu();

  const parameters = useMemo(() => parametersFor(fields, items), [fields, items]);
  const categories = useMemo(() => categoriesFor(fields), [fields]);

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

  // Empties the draft and, in the Panel, the applied filter in the address too.
  const clearAll = () => {
    actions.clear();
    if (mode === 'panel') setParam(null);
  };

  const emptyWhen = (count: number): ReactNode =>
    count === 0 && conditions.length > 0 ? <NoFilterResults onClear={clearAll} /> : undefined;

  // The chevron beside "Apply filter": apply, and keep the filtered list as a view in Favourites (Figma's
  // Favorites panel lists views with their filter indicator, 4145:13665).
  const applyMenu = useAnchoredMenu();
  const { save: saveFavorite } = useFavorites();
  const applyAndSave = () => {
    const serialized = serializeApplied(root);
    setParam(serialized);
    if (!serialized) return;
    const page = splitPersonaHash(window.location.hash).path.split('?')[0];
    saveFavorite({
      id: `view:${page}`,
      name: options.viewName ?? 'Saved view',
      type: 'View',
      href: `${page}?filter=${encodeURIComponent(serialized)}`,
      filterCount: completeConditions(root).length,
    });
  };

  usePublishDockPanel(
    mode === 'panel'
      ? {
          open,
          element: (
            <>
              <AdvancedFilterPanel
                root={root}
                parameters={parameters}
                categories={categories}
                actions={actions}
                addLabel="Add filter"
                syntaxes={[{ id: 'ldap', label: 'LDAP', code: toLdap(root, LDAP_ATTRIBUTES) }]}
                onClose={() => setOpen(false)}
                onCancel={() => {
                  actions.replace(applied);
                  setOpen(false);
                }}
                onApply={() => setParam(serializeApplied(root))}
                onApplyMenu={applyMenu.openAt}
                guideHref={FILTERS_GUIDE_URL}
                // With a filter applied, keep the footer so a cleared draft can still be applied.
                showGuide={root.children.length === 0 && applied.children.length === 0}
              />
              <Menu
                {...applyMenu.menuProps}
                ariaLabel="More apply options"
                items={[{ kind: 'item', label: 'Apply and save as view', icon: 'Star', onSelect: applyAndSave }]}
              />
            </>
          ),
        }
      : undefined,
  );

  if (mode === 'panel') {
    return {
      filtered,
      filterCount: conditions.length,
      onFilter: togglePanel,
      filterPressed: open,
      clear: clearAll,
      emptyWhen,
      bar: null,
      elements: null,
    };
  }

  // Bar: the filter button opens the "Add filter" menu. A field adds a pill with its usual operator and
  // opens the values under it; "Add filter group" adds the grey "Advanced filter" pill and opens its group,
  // which holds only "+ Filter" (Figma 4145:57189, 10126:3944).
  const addCard = (parameterId?: string) => {
    const param = parameters.find((p) => p.id === parameterId);
    // A field's pill holds one card, as the popover draws everything at its top as a card (Figma 10126:4485).
    const card = newGroup('and', param ? [newGroup('and', [newCondition({ parameterId, operatorId: defaultOperatorFor(param) })])] : []);
    actions.replace({ ...root, children: [...root.children, card] });
    setEditing({ id: card.id, view: param ? 'value' : 'group' });
  };
  const entries = addFilterMenu(parameters, categories, (parameterId) => addCard(parameterId), () => addCard());

  return {
    filtered,
    filterCount: conditions.length,
    onFilter: menu.openAt,
    filterPressed: false,
    clear: clearAll,
    emptyWhen,
    bar:
      root.children.length === 0 ? null : (
        <AdvancedFilterBar
          root={root}
          parameters={parameters}
          categories={categories}
          actions={actions}
          editing={editing}
          onEditingChange={setEditing}
          renderPill={options.renderPill}
          inline={options.inlinePills}
        />
      ),
    elements: <Menu {...menu.menuProps} items={entries} ariaLabel="Add filter" />,
  };
}
