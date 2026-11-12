import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  /** The pill whose group is open for editing. Controlled when given; the Bar tracks it itself otherwise. */
  editingId?: string | null;
  onEditingIdChange?: (id: string | null) => void;
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

/** Where the popover sits: under its pill, kept inside the window. */
function placeUnder(pill: HTMLElement): { top: number; left: number } {
  const rect = pill.getBoundingClientRect();
  const margin = 8;
  const width = Math.min(435, window.innerWidth * 0.9);
  return { top: rect.bottom + 4, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
}

/**
 * AdvancedFilterBar — the Advanced filter "Bar": the applied filter as pills under the content header.
 * Pressing a pill opens its group in a popover. Figma: Iris UI Kit "Advanced Filter Bar" 9722:13727.
 */
export function AdvancedFilterBar({
  root,
  parameters,
  actions,
  showEmpty = false,
  editingId: editingIdProp,
  onEditingIdChange,
  className,
}: AdvancedFilterBarProps) {
  const [internalId, setInternalId] = useState<string | null>(null);
  const editingId = editingIdProp !== undefined ? editingIdProp : internalId;
  const setEditingId = useCallback(
    (id: string | null) => {
      setInternalId(id);
      onEditingIdChange?.(id);
    },
    [onEditingIdChange],
  );

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);

  const reposition = useCallback(() => {
    const pill = editingId ? items.current.get(editingId) : undefined;
    setPlace(pill ? placeUnder(pill) : null);
  }, [editingId]);

  useLayoutEffect(reposition, [reposition, root]);

  useEffect(() => {
    if (!editingId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      // Menus and pickers opened from inside the popover render in portals of their own.
      if (popoverRef.current?.contains(target)) return;
      if (target.closest('[role="menu"], [role="listbox"], [role="dialog"]')) return;
      if (target.closest('[data-filter-pill]')) return;
      setEditingId(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Close only the popover, not a dialog the Bar sits in.
      e.stopPropagation();
      setEditingId(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [editingId, reposition, setEditingId]);

  if (root.children.length === 0 && !showEmpty) return null;

  const editing = root.children.find((n) => n.id === editingId);

  return (
    <div className={cx(styles.root, className)} role="group" aria-label="Applied filters">
      {root.children.length === 0 ? (
        <FilterPill empty parameter={{ label: 'Advanced filter', icon: 'FunnelSimple' }} removeLabel="Clear filter" onRemove={actions.clear} />
      ) : (
        root.children.map((node) => (
          <div
            key={node.id}
            className={styles.item}
            data-filter-pill
            ref={(el) => {
              if (el) items.current.set(node.id, el);
              else items.current.delete(node.id);
            }}
          >
            <FilterPill
              {...pillProps(node, parameters)}
              onEdit={() => setEditingId(editingId === node.id ? null : node.id)}
              onRemove={() => {
                if (editingId === node.id) setEditingId(null);
                actions.remove(node.id);
              }}
              removeLabel="Remove filter"
            />
          </div>
        ))
      )}
      {editing && editing.kind === 'group' && place &&
        createPortal(
          <div
            ref={popoverRef}
            className={styles.popover}
            style={{ top: place.top, left: place.left }}
            role="dialog"
            aria-label="Edit filter"
          >
            <FilterGroup group={editing} parameters={parameters} actions={actions} />
          </div>,
          document.body,
        )}
    </div>
  );
}
