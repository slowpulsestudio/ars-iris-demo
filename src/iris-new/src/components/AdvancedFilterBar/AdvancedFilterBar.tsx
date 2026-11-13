import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@iris/lib/cx.js';
import { motionDurationMs, prefersReducedMotion } from '@iris/lib/motion.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import {
  OPERATORS,
  OPERATOR_BY_ID,
  firstCondition,
  countConditions,
  operatorTakesValue,
  type Condition,
  type FilterNode,
  type Group,
  type OperatorId,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import { FilterGroup } from '../FilterGroup/FilterGroup.js';
import { FilterPill, type FilterPillProps, type FilterPillSegment } from '../FilterPill/FilterPill.js';
import { FilterValueEditor } from '../FilterValueEditor/FilterValueEditor.js';
import styles from './AdvancedFilterBar.module.css';

/** What a pill's popover edits: its value (a list under the value), its operator (a menu under the operator), or the whole group. */
export type AdvancedFilterBarEditView = 'value' | 'operator' | 'group';

export interface AdvancedFilterBarEditing {
  /** The pill (top-level node of the filter tree). */
  id: string;
  view: AdvancedFilterBarEditView;
}

export interface AdvancedFilterBarProps {
  /** The filter tree. Each top-level rule card (or condition) becomes one pill. */
  root: Group;
  parameters: ParameterDef[];
  actions: FilterModelActions;
  /** Shows the grey "Advanced filter" pill while the tree is empty. */
  showEmpty?: boolean;
  /** The pill being edited, and what of it. Controlled when given; the Bar tracks it itself otherwise. */
  editing?: AdvancedFilterBarEditing | null;
  onEditingChange?: (editing: AdvancedFilterBarEditing | null) => void;
  /** Draws each pill another way, e.g. the ARS filter tag. The Bar still owns opening and removing. */
  renderPill?: (pill: AdvancedFilterBarPill) => ReactNode;
  /** Only the pills, with no tray of their own, for a parent that draws the strip (the ARS filter area). */
  inline?: boolean;
  className?: string;
}

/** What a pill shows: the first condition of its group, and how many more the group holds. */
export interface AdvancedFilterBarPill {
  field: string;
  operatorId?: OperatorId;
  /** The operator's label, e.g. "equals". */
  operator: string;
  values: string[];
  /** Conditions in the group beyond the first. */
  extra: number;
  /** Opens the editor; without a segment it is the pill's value. */
  onEdit: (segment?: FilterPillSegment) => void;
  onRemove: () => void;
}


function summarizePill(node: FilterNode, parameters: ParameterDef[]): Omit<AdvancedFilterBarPill, 'onEdit' | 'onRemove'> {
  const lead = firstCondition(node);
  const param = parameters.find((p) => p.id === lead?.parameterId);
  const labels = new Map((param?.options ?? []).map((o) => [o.value, o.label]));
  return {
    field: param?.label ?? 'Parameter',
    operatorId: lead?.operatorId,
    operator: lead?.operatorId ? OPERATOR_BY_ID[lead.operatorId].label : 'operator',
    values: (lead?.values ?? []).map((v) => labels.get(v) ?? v),
    extra: countConditions(node) - 1,
  };
}

function pillProps(node: FilterNode, parameters: ParameterDef[]): Pick<FilterPillProps, 'parameter' | 'operator' | 'value' | 'more'> {
  const lead: Condition | null = firstCondition(node);
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

/** Where the popover sits: under its anchor (a pill or one segment of it), kept inside the window. */
function placeUnder(anchor: HTMLElement, popoverWidth: number): { top: number; left: number } {
  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const width = Math.min(popoverWidth, window.innerWidth * 0.9);
  return { top: rect.bottom + 4, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
}

/** The popover under a pill's value is the 240px FilterSelect menu; the group editor is the wide card. */
const VALUE_POPOVER_WIDTH = 240;
const GROUP_POPOVER_WIDTH = 435;

/**
 * AdvancedFilterBar — the Advanced filter "Bar": the applied filter as pills under the content header.
 * Pressing a pill's value opens its values under it, its operator opens the operators, and "and N more
 * conditions" opens the whole group. Figma: Iris UI Kit "Advanced Filter Bar" 9722:13727.
 */
export function AdvancedFilterBar({
  root,
  parameters,
  actions,
  showEmpty = false,
  editing: editingProp,
  onEditingChange,
  renderPill,
  inline = false,
  className,
}: AdvancedFilterBarProps) {
  const [internal, setInternal] = useState<AdvancedFilterBarEditing | null>(null);
  const editing = editingProp !== undefined ? editingProp : internal;
  const setEditing = useCallback(
    (next: AdvancedFilterBarEditing | null) => {
      setInternal(next);
      onEditingChange?.(next);
    },
    [onEditingChange],
  );
  const editingId = editing?.id ?? null;
  const editingView = editing?.view ?? null;

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);

  const reposition = useCallback(() => {
    // Keep the last place while the popover fades out.
    if (!editingId || !editingView) return;
    const item = items.current.get(editingId);
    const anchor = editingView === 'group' ? item : (item?.querySelector<HTMLElement>(`[data-segment="${editingView}"]`) ?? item);
    setPlace(anchor ? placeUnder(anchor, editingView === 'value' ? VALUE_POPOVER_WIDTH : GROUP_POPOVER_WIDTH) : null);
  }, [editingId, editingView]);

  useLayoutEffect(reposition, [reposition, root]);

  // The pill and its tray animate in, so measure again once they have settled.
  useEffect(() => {
    if (!editingId) return undefined;
    const frame = window.requestAnimationFrame(reposition);
    const settle = window.setTimeout(reposition, prefersReducedMotion() ? 0 : motionDurationMs('--oi-motion-duration-default') + 50);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [editingId, editingView, reposition]);

  // The popover stays mounted while it fades out; a pill being removed stays until it has faded.
  const [mounted, setMounted] = useState<AdvancedFilterBarEditing | null>(editing);
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(() => new Set());
  const exitMs = () => (prefersReducedMotion() ? 0 : motionDurationMs('--oi-motion-duration-short'));

  useEffect(() => {
    if (editing) {
      setMounted(editing);
      return undefined;
    }
    if (!mounted) return undefined;
    const t = window.setTimeout(() => setMounted(null), exitMs());
    return () => window.clearTimeout(t);
  }, [editing, mounted]);

  const removePill = (id: string) => {
    if (editingId === id) setEditing(null);
    if (exitMs() === 0) {
      actions.remove(id);
      return;
    }
    setLeaving((s) => new Set(s).add(id));
    window.setTimeout(() => {
      actions.remove(id);
      setLeaving((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }, exitMs());
  };

  useEffect(() => {
    if (!editingId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      // Menus and pickers opened from inside the popover render in portals of their own.
      if (popoverRef.current?.contains(target)) return;
      if (target.closest('[role="menu"], [role="listbox"]')) return;
      if (target.closest('[data-filter-pill]')) return;
      setEditing(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Close only the popover, not a dialog the Bar sits in.
      e.stopPropagation();
      setEditing(null);
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
  }, [editingId, reposition, setEditing]);

  const operatorPicked = useRef(false);
  const operatorItems = useMemo<MenuEntry[]>(() => {
    const target = root.children.find((n) => n.id === editingId);
    const lead = target ? firstCondition(target) : null;
    if (!lead) return [];
    return OPERATORS.map((o) => ({
      kind: 'item',
      label: o.label,
      icon: o.icon,
      selected: o.id === lead.operatorId,
      onSelect: () => {
        actions.updateCondition(
          lead.id,
          o.id === 'empty' || o.id === 'between' || lead.operatorId === 'between' ? { operatorId: o.id, values: [] } : { operatorId: o.id },
        );
        // The Menu closes itself after a pick; most operators then need a value, so go on to it.
        operatorPicked.current = true;
        setEditing(operatorTakesValue(o.id) ? { id: target.id, view: 'value' } : null);
      },
    }));
  }, [root, editingId, actions, setEditing]);

  if (root.children.length === 0 && !showEmpty) return null;

  const mountedNode = root.children.find((n) => n.id === mounted?.id);
  const mountedLead = mountedNode ? firstCondition(mountedNode) : null;
  const mountedParam = parameters.find((p) => p.id === mountedLead?.parameterId);
  const wide = mounted?.view === 'group';

  /** A pill with one condition edits its value and operator in place; a longer one opens its whole group. */
  const editSegment = (node: FilterNode, segment: FilterPillSegment = 'value') => {
    const single = countConditions(node) === 1;
    const view: AdvancedFilterBarEditView =
      !single || segment === 'parameter' || segment === 'more' ? 'group' : segment === 'operator' ? 'operator' : 'value';
    setEditing(editingId === node.id && editingView === view ? null : { id: node.id, view });
  };

  return (
    <div className={cx(styles.root, inline && styles.inline, className)} role="group" aria-label="Applied filters">
      {root.children.length === 0 ? (
        <FilterPill empty parameter={{ label: 'Advanced filter', icon: 'FunnelSimple' }} removeLabel="Clear filter" onRemove={actions.clear} />
      ) : (
        root.children.map((node) => (
          <div
            key={node.id}
            className={styles.item}
            data-filter-pill
            data-leaving={leaving.has(node.id) || undefined}
            ref={(el) => {
              if (el) items.current.set(node.id, el);
              else items.current.delete(node.id);
            }}
          >
            {(() => {
              const onEdit = (segment?: FilterPillSegment) => editSegment(node, segment);
              const onRemove = () => removePill(node.id);
              return renderPill ? (
                renderPill({ ...summarizePill(node, parameters), onEdit, onRemove })
              ) : (
                <FilterPill {...pillProps(node, parameters)} onEdit={onEdit} onRemove={onRemove} removeLabel="Remove filter" />
              );
            })()}
          </div>
        ))
      )}
      {mountedNode && place && mounted?.view !== 'operator' &&
        createPortal(
          <div
            ref={popoverRef}
            className={cx(styles.popover, !wide && styles.valuePopover)}
            data-state={editing ? 'open' : 'closing'}
            style={{ top: place.top, left: place.left }}
            role="dialog"
            aria-label={wide ? 'Edit filter' : `Edit ${mountedParam?.label ?? 'filter'}`}
          >
            {wide && mountedNode.kind === 'group' ? (
              <FilterGroup group={mountedNode} parameters={parameters} actions={actions} />
            ) : (
              mountedLead && (
                <FilterValueEditor
                  condition={mountedLead}
                  parameter={mountedParam}
                  onChange={(patch) => actions.updateCondition(mountedLead.id, patch)}
                  onDone={() => setEditing(null)}
                />
              )
            )}
          </div>,
          document.body,
        )}
      {editing?.view === 'operator' && place && (
        <Menu
          open
          ariaLabel="Select an operator"
          items={operatorItems}
          position={{ x: place.left, y: place.top }}
          onOpenChange={(open) => {
            if (open) return;
            if (operatorPicked.current) operatorPicked.current = false;
            else setEditing(null);
          }}
        />
      )}
    </div>
  );
}
