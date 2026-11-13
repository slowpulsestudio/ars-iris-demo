import type { Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import {
  OPERATOR_BY_ID,
  countConditions,
  firstCondition,
  operatorTakesValue,
  type BooleanOp,
  type FilterNode,
  type Group,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import { FilterPill, type FilterPillProps, type FilterPillSegment } from '../FilterPill/FilterPill.js';
import { FilterSep } from '../FilterSep/FilterSep.js';
import { MAX_GROUP_LEVELS } from '../FilterGroup/FilterGroup.js';
import styles from './FilterBarGroup.module.css';

/** A pill's segments for a node: its first condition, and "and N more conditions" for the rest. */
export function pillProps(node: FilterNode, parameters: ParameterDef[]): Pick<FilterPillProps, 'parameter' | 'operator' | 'value' | 'more'> {
  const lead = firstCondition(node);
  const param = parameters.find((p) => p.id === lead?.parameterId);
  const op = lead?.operatorId ? OPERATOR_BY_ID[lead.operatorId] : undefined;
  const extra = countConditions(node) - 1;
  const labels = new Map((param?.options ?? []).map((o) => [o.value, o.label]));
  const value = lead?.values.map((v) => labels.get(v) ?? v).join(lead.operatorId === 'between' ? ' and ' : ', ');
  return {
    parameter: { label: param?.label ?? 'Parameter', icon: param?.icon },
    operator: op ? { label: op.label, icon: op.icon } : { label: 'operator', icon: 'DiamondsFour' },
    value: operatorTakesValue(lead?.operatorId) ? value || 'Value' : undefined,
    more: extra > 0 ? { connector: node.kind === 'group' ? node.op : 'and', count: extra } : undefined,
  };
}

/** The "+ Filter" menu: a filter group, then each category's fields. Figma "+ Filter" menu 10126:3962. */
export function addFilterMenu(
  parameters: ParameterDef[],
  categories: ParamCategory[],
  onAddCondition: (parameterId: string) => void,
  onAddGroup?: () => void,
): MenuEntry[] {
  const byId = new Map(parameters.map((p) => [p.id, p]));
  return [
    ...(onAddGroup ? ([{ kind: 'item', label: 'Add filter group', icon: 'FunnelSimple', onSelect: onAddGroup }, { kind: 'divider' }] as MenuEntry[]) : []),
    ...categories.map(
      (cat): MenuEntry => ({
        kind: 'submenu',
        label: cat.label,
        icon: cat.icon,
        items: cat.parameterIds
          .map((id) => byId.get(id))
          .filter((p): p is ParameterDef => Boolean(p))
          .map((p) => ({ kind: 'item', label: p.label, icon: p.icon, onSelect: () => onAddCondition(p.id) })),
      }),
    ),
  ];
}

export interface FilterBarGroupProps {
  /** The pill's rule card: its conditions as pills and its groups as cards. */
  group: Group;
  parameters: ParameterDef[];
  categories: ParamCategory[];
  onAddCondition: (parentId: string, parameterId: string) => void;
  onAddGroup: (parentId: string) => void;
  onRemove: (id: string) => void;
  onSetOp: (id: string, op: BooleanOp) => void;
  /** A segment of a condition's pill was pressed. */
  onEditCondition: (conditionId: string, segment: FilterPillSegment) => void;
}

/**
 * FilterBarGroup — what the Advanced filter Bar's popover holds: conditions as pills, groups as grey
 * cards (dashed when nested), AND/OR chips beside groups, and "+ Filter" to add more.
 * Figma: Iris UI Kit "Default, interactions" and "Nesting, interactions" 10126:4485, 10153:4683.
 */
export function FilterBarGroup({ group, parameters, categories, onAddCondition, onAddGroup, onRemove, onSetOp, onEditCondition }: FilterBarGroupProps) {
  const chip = (g: Group) => (
    <FilterSep variant="chip" op={g.op === 'and' ? 'AND' : 'OR'} onToggle={() => onSetOp(g.id, g.op === 'and' ? 'or' : 'and')} />
  );

  const addButton = (g: Group, level: number) => (
    <span data-add-filter>
      <Menu
        ariaLabel="Add filter"
        align="start"
        items={addFilterMenu(
          parameters,
          categories,
          (parameterId) => onAddCondition(g.id, parameterId),
          level < MAX_GROUP_LEVELS ? () => onAddGroup(g.id) : undefined,
        )}
        trigger={({ ref, onClick, expanded }) => (
          <Button
            ref={ref as Ref<HTMLButtonElement>}
            variant="secondary"
            size="s"
            iconLead="Plus"
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          >
            Filter
          </Button>
        )}
      />
    </span>
  );

  const item = (node: FilterNode, parent: Group, level: number, joined: boolean) => {
    if (node.kind === 'condition') {
      return (
        <span key={node.id} className={styles.pill} data-condition-id={node.id}>
          <FilterPill
            {...pillProps(node, parameters)}
            onEdit={(segment) => onEditCondition(node.id, segment)}
            onRemove={() => onRemove(node.id)}
            removeLabel="Remove condition"
          />
        </span>
      );
    }
    const body = card(node, level + 1);
    return joined ? (
      <div key={node.id} className={styles.joined}>
        {chip(parent)}
        {body}
      </div>
    ) : (
      <div key={node.id} className={styles.full}>
        {body}
      </div>
    );
  };

  const card = (g: Group, level: number) => (
    <div className={cx(styles.card, level > 2 && styles.nested)} data-group-id={g.id}>
      {g.children.map((child) => item(child, g, level, true))}
      {addButton(g, level)}
    </div>
  );

  return (
    <div className={styles.root} data-group-id={group.id}>
      {group.children.map((child, i) => item(child, group, 1, i > 0))}
      <div className={styles.footer}>
        {group.children.length > 0 && chip(group)}
        {addButton(group, 1)}
      </div>
    </div>
  );
}
