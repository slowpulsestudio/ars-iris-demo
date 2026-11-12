import { useEffect, useRef, useState } from 'react';
import { cx } from '@iris/lib/cx.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import {
  OPERATOR_BY_ID,
  firstCondition,
  countConditions,
  operatorTakesValue,
  type Condition,
  type FilterNode,
  type Group,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import { FilterGroup } from '../FilterGroup/FilterGroup.js';
import { FilterPill, type FilterPillProps } from '../FilterPill/FilterPill.js';
import styles from './AdvancedFilterBar.module.css';

export interface AdvancedFilterBarProps {
  /** The filter tree. Each top-level rule card (or condition) becomes one pill. */
  root: Group;
  parameters: ParameterDef[];
  actions: FilterModelActions;
  /** Shows the grey "Advanced filter" pill while the tree is empty. */
  showEmpty?: boolean;
  className?: string;
}

function pillProps(node: FilterNode, parameters: ParameterDef[]): Pick<FilterPillProps, 'parameter' | 'operator' | 'value' | 'more'> {
  const lead: Condition | null = firstCondition(node);
  const param = parameters.find((p) => p.id === lead?.parameterId);
  const op = lead?.operatorId ? OPERATOR_BY_ID[lead.operatorId] : undefined;
  const extra = countConditions(node) - 1;
  const labels = new Map((param?.options ?? []).map((o) => [o.value, o.label]));
  const value = lead?.values.map((v) => labels.get(v) ?? v).join(', ');
  return {
    parameter: { label: param?.label ?? 'Parameter', icon: param?.icon },
    operator: op ? { label: op.label, icon: op.icon } : { label: 'operator', icon: 'DiamondsFour' },
    value: operatorTakesValue(lead?.operatorId) ? value || 'Value' : undefined,
    more: extra > 0 ? { connector: node.kind === 'group' ? node.op : 'and', count: extra } : undefined,
  };
}

/**
 * AdvancedFilterBar — the Advanced filter "Bar": the applied filter as pills under the content header.
 * Pressing a pill opens its group in a popover. Figma: Iris UI Kit "Advanced Filter Bar" 9722:13727.
 */
export function AdvancedFilterBar({ root, parameters, actions, showEmpty = false, className }: AdvancedFilterBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editingId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      // Menus and pickers opened from inside the popover render in portals.
      if (popoverRef.current?.contains(target)) return;
      if (target.closest('[role="menu"], [role="listbox"], [role="dialog"]')) return;
      if (target.closest('[data-filter-pill]')) return;
      setEditingId(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingId(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [editingId]);

  if (root.children.length === 0 && !showEmpty) return null;

  return (
    <div className={cx(styles.root, className)} role="group" aria-label="Applied filters">
      {root.children.length === 0 ? (
        <FilterPill empty parameter={{ label: 'Advanced filter', icon: 'FunnelSimple' }} removeLabel="Clear filter" onRemove={actions.clear} />
      ) : (
        root.children.map((node) => (
          <div key={node.id} className={styles.item} data-filter-pill>
            <FilterPill
              {...pillProps(node, parameters)}
              onEdit={() => setEditingId(editingId === node.id ? null : node.id)}
              onRemove={() => actions.remove(node.id)}
              removeLabel="Remove filter"
            />
            {editingId === node.id && node.kind === 'group' && (
              <div ref={popoverRef} className={styles.popover} role="dialog" aria-label="Edit filter">
                <FilterGroup group={node} parameters={parameters} actions={actions} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
