import { useState } from 'react';
import { cx } from '@iris/lib/cx.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import { newCondition, type Group, type ParameterDef } from '@iris/components/Filters/filterModel.js';
import { FilterCondition } from '../FilterCondition/FilterCondition.js';
import { FilterSep } from '../FilterSep/FilterSep.js';
import { PanelInlineActions } from '../PanelInlineActions/PanelInlineActions.js';
import styles from './FilterGroup.module.css';

/** A group can nest until it sits at this level (card = 1). Matches the Iris Filters nesting cap. */
export const MAX_GROUP_LEVELS = 3;

export interface FilterGroupProps {
  group: Group;
  parameters: ParameterDef[];
  actions: FilterModelActions;
  /** 1 = a top-level rule card, 2+ = a nested dashed group. */
  level?: number;
  className?: string;
}

/**
 * FilterGroup — a rule card (level 1) or nested dashed group: conditions joined by the group's
 * AND/OR, "+New condition" and "+New filter group". The group you are working in is brand tinted.
 * Figma: Iris UI Kit "Advanced Filter Panel" 9956:7605.
 */
export function FilterGroup({ group, parameters, actions, level = 1, className }: FilterGroupProps) {
  // Focus inside any group makes the innermost one the active (brand tinted) group.
  const [active, setActive] = useState(false);
  const isCard = level === 1;
  const op = group.op === 'and' ? 'AND' : 'OR';
  const canNest = level < MAX_GROUP_LEVELS;

  const removeCondition = (id: string) => {
    // Deleting the only condition takes the now empty group with it.
    if (group.children.length === 1) actions.remove(group.id);
    else actions.remove(id);
  };

  return (
    <div
      className={cx(styles.group, isCard ? styles.card : styles.nested, active && styles.active, className)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(false);
      }}
      data-group-id={group.id}
    >
      {group.children.map((child, i) =>
        child.kind === 'condition' ? (
          <div key={child.id} className={styles.row}>
            {i > 0 && (
              <FilterSep op={op} onToggle={() => actions.setOp(group.id, group.op === 'and' ? 'or' : 'and')} />
            )}
            <FilterCondition
              condition={child}
              parameters={parameters}
              onChange={(patch) => actions.updateCondition(child.id, patch)}
              onRemove={() => removeCondition(child.id)}
            />
          </div>
        ) : (
          <div key={child.id} className={styles.nestedRow}>
            <FilterSep
              variant="chip"
              op={child.op === 'and' ? 'AND' : 'OR'}
              onToggle={() => actions.setOp(child.id, child.op === 'and' ? 'or' : 'and')}
            />
            <FilterGroup group={child} parameters={parameters} actions={actions} level={level + 1} />
          </div>
        ),
      )}
      <PanelInlineActions
        onAddCondition={() => actions.addCondition(group.id)}
        onAddGroup={canNest ? () => actions.addGroup(group.id, 'and', [newCondition()]) : undefined}
      />
    </div>
  );
}
