import type { Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Menu } from '@iris/components/Menu/Menu.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import {
  OPERATOR_BY_ID,
  countConditions,
  firstCondition,
  operatorTakesValue,
  type BooleanOp,
  type Condition,
  type FilterNode,
  type Group,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import { addFilterMenu } from '../../lib/addFilterMenu.js';
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

export interface FilterBarGroupProps {
  /** The pill's filter: its conditions as pills and its groups as cards. */
  group: Group;
  parameters: ParameterDef[];
  categories: ParamCategory[];
  /** The group being worked in (the one just added): tinted, as Figma marks it. */
  activeGroupId?: string | null;
  onAddCondition: (parentId: string, parameterId: string) => void;
  onAddGroup: (parentId: string) => void;
  onRemove: (id: string) => void;
  onSetOp: (id: string, op: BooleanOp) => void;
  /** A segment of a condition's pill was pressed. */
  onEditCondition: (conditionId: string, segment: FilterPillSegment) => void;
}

/**
 * FilterBarGroup — what the Advanced filter Bar's popover holds. At the top: conditions as pills and
 * groups as grey cards, the later ones behind an AND/OR chip, then the chip and "+ Filter". In a card:
 * its pills, its nested groups (dashed) and "+ Filter". In a nested group: its pills and "+ Filter",
 * then each group inside it, with a chip on every row when it holds groups.
 * Figma: Iris UI Kit "Default, interactions" 10126:4485 and "Nesting, interactions" 10153:4683.
 */
export function FilterBarGroup({
  group,
  parameters,
  categories,
  activeGroupId,
  onAddCondition,
  onAddGroup,
  onRemove,
  onSetOp,
  onEditCondition,
}: FilterBarGroupProps) {
  const chip = (g: Group) => (
    <FilterSep variant="chip" op={g.op === 'and' ? 'AND' : 'OR'} onToggle={() => onSetOp(g.id, g.op === 'and' ? 'or' : 'and')} />
  );

  // "+ Filter" adds a field's condition anywhere; groups nest to the Panel's depth.
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

  const pill = (c: Condition) => (
    <span key={c.id} className={styles.pill} data-condition-id={c.id}>
      <FilterPill
        {...pillProps(c, parameters)}
        onEdit={(segment) => onEditCondition(c.id, segment)}
        onRemove={() => onRemove(c.id)}
        removeLabel="Remove condition"
      />
    </span>
  );

  const nested = (g: Group, level: number) => {
    const conditions = g.children.filter((c): c is Condition => c.kind === 'condition');
    const groups = g.children.filter((c): c is Group => c.kind === 'group');
    const block = (
      <div className={styles.block}>
        {conditions.map(pill)}
        {addButton(g, level)}
      </div>
    );
    return (
      <div className={cx(styles.card, styles.nested, g.id === activeGroupId && styles.active)} data-group-id={g.id}>
        {groups.length > 0 ? (
          <div className={styles.row}>
            {chip(g)}
            {block}
          </div>
        ) : (
          block
        )}
        {groups.map((child) => (
          <div key={child.id} className={styles.row}>
            {chip(g)}
            {nested(child, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  const card = (g: Group) => (
    <div className={cx(styles.card, g.id === activeGroupId && styles.active)} data-group-id={g.id}>
      {g.children.map((child) =>
        child.kind === 'condition' ? (
          pill(child)
        ) : (
          <div key={child.id} className={styles.full}>
            {nested(child, 2)}
          </div>
        ),
      )}
      {addButton(g, 1)}
    </div>
  );

  return (
    <div className={styles.root} data-group-id={group.id}>
      {group.children.map((child, i) =>
        child.kind === 'condition' ? (
          pill(child)
        ) : i === 0 ? (
          <div key={child.id} className={styles.full}>
            {card(child)}
          </div>
        ) : (
          <div key={child.id} className={styles.joined}>
            {chip(group)}
            {card(child)}
          </div>
        ),
      )}
      <div className={styles.footer}>
        {group.children.length > 0 && chip(group)}
        {addButton(group, 0)}
      </div>
    </div>
  );
}
