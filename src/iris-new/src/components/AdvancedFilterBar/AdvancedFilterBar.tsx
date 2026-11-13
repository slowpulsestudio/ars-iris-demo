import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@iris/lib/cx.js';
import { motionDurationMs, prefersReducedMotion } from '@iris/lib/motion.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import {
  OPERATORS,
  OPERATOR_BY_ID,
  appendChild,
  countConditions,
  defaultOperatorFor,
  findNode,
  firstCondition,
  newCondition,
  newGroup,
  operatorTakesValue,
  type Condition,
  type FilterNode,
  type Group,
  type OperatorId,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import { FilterBarGroup, pillProps } from '../FilterBarGroup/FilterBarGroup.js';
import { FilterPill, type FilterPillSegment } from '../FilterPill/FilterPill.js';
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
  /** The field groups the "+ Filter" menu lists. Defaults to one "Common" group of every parameter. */
  categories?: ParamCategory[];
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
  /** The field holds dates: the ARS filter draws it as a date pill. */
  date?: boolean;
  /** Opens the editor; without a segment it is the pill's value. */
  onEdit: (segment?: FilterPillSegment) => void;
  onRemove: () => void;
}

type Place = { top: number; left: number };
type Segment = 'value' | 'operator' | 'parameter';

function summarizePill(node: FilterNode, parameters: ParameterDef[]): Omit<AdvancedFilterBarPill, 'onEdit' | 'onRemove'> {
  const lead = firstCondition(node);
  const param = parameters.find((p) => p.id === lead?.parameterId);
  const labels = new Map((param?.options ?? []).map((o) => [o.value, o.label]));
  return {
    field: lead ? (param?.label ?? 'Parameter') : 'Advanced filter',
    operatorId: lead?.operatorId,
    operator: lead?.operatorId ? OPERATOR_BY_ID[lead.operatorId].label : lead ? 'operator' : '',
    values: (lead?.values ?? []).map((v) => labels.get(v) ?? v),
    extra: Math.max(0, countConditions(node) - 1),
    date: param?.date,
  };
}

/** Where a popover sits: under its anchor (a pill or one segment of it), kept inside the window. */
function placeUnder(anchor: HTMLElement, popoverWidth: number): Place {
  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const width = Math.min(popoverWidth, window.innerWidth * 0.9);
  return { top: rect.bottom + 4, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
}

/** The value popover is the 240px FilterSelect menu; the group popover hugs its pills. */
const VALUE_POPOVER_WIDTH = 240;
const GROUP_POPOVER_WIDTH = 480;

interface ConditionEditorProps {
  condition: Condition;
  parameters: ParameterDef[];
  segment: Segment;
  place: Place;
  actions: FilterModelActions;
  onClose: () => void;
  /** After a new operator or field, what to edit next (the value), or nothing. */
  onNext: (segment: Segment | null) => void;
}

/** The small editor for one condition: its values in a popover, or a menu of its operators or fields. */
function ConditionEditor({ condition, parameters, segment, place, actions, onClose, onNext }: ConditionEditorProps) {
  // The Menu closes itself after a pick; a pick goes on to the value instead of closing.
  const picked = useRef(false);
  const param = parameters.find((p) => p.id === condition.parameterId);

  if (segment === 'value') {
    return createPortal(
      <div
        className={cx(styles.popover, styles.valuePopover)}
        data-filter-popover
        style={place}
        role="dialog"
        aria-label={`Edit ${param?.label ?? 'filter'}`}
      >
        <FilterValueEditor
          condition={condition}
          parameter={param}
          onChange={(patch) => actions.updateCondition(condition.id, patch)}
          onDone={onClose}
        />
      </div>,
      document.body,
    );
  }

  const items: MenuEntry[] =
    segment === 'operator'
      ? OPERATORS.map((o) => ({
          kind: 'item',
          label: o.label,
          icon: o.icon,
          selected: o.id === condition.operatorId,
          onSelect: () => {
            actions.updateCondition(
              condition.id,
              o.id === 'empty' || o.id === 'between' || condition.operatorId === 'between' ? { operatorId: o.id, values: [] } : { operatorId: o.id },
            );
            picked.current = true;
            onNext(operatorTakesValue(o.id) ? 'value' : null);
          },
        }))
      : parameters.map((p) => ({
          kind: 'item',
          label: p.label,
          icon: p.icon,
          selected: p.id === condition.parameterId,
          onSelect: () => {
            // The value type can differ between fields, so a new field clears the value.
            actions.updateCondition(condition.id, { parameterId: p.id, operatorId: defaultOperatorFor(p), values: [] });
            picked.current = true;
            onNext('value');
          },
        }));

  return (
    <Menu
      open
      ariaLabel={segment === 'operator' ? 'Select an operator' : 'Select a field'}
      items={items}
      position={{ x: place.left, y: place.top }}
      onOpenChange={(open) => {
        if (open) return;
        if (picked.current) picked.current = false;
        else onClose();
      }}
    />
  );
}

/**
 * AdvancedFilterBar — the Advanced filter "Bar": the applied filter as pills under the content header.
 * A one-condition pill edits its value and operator in place, under the segment pressed. Its field, "and N
 * more conditions" and the "Advanced filter" pill open the pill's group: conditions as pills, groups as
 * cards, AND/OR chips and "+ Filter". Figma: Iris UI Kit "Advanced Filter Bar" 9722:13727.
 */
export function AdvancedFilterBar({
  root,
  parameters,
  categories,
  actions,
  showEmpty = false,
  editing: editingProp,
  onEditingChange,
  renderPill,
  inline = false,
  className,
}: AdvancedFilterBarProps) {
  const fieldGroups = useMemo<ParamCategory[]>(
    () => categories ?? [{ label: 'Common', icon: 'IdentificationCard', parameterIds: parameters.map((p) => p.id) }],
    [categories, parameters],
  );

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

  // A condition inside the open group being edited: its values, operator or field, under that segment.
  const [inner, setInner] = useState<{ conditionId: string; segment: Segment } | null>(null);
  const [innerPlace, setInnerPlace] = useState<Place | null>(null);
  // The group just added: tinted as the group being worked in, until another is added or the popover closes.
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  useEffect(() => {
    setInner(null);
    setActiveGroupId(null);
  }, [editingId, editingView]);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const [place, setPlace] = useState<Place | null>(null);

  const reposition = useCallback(() => {
    // Keep the last place while the popover fades out.
    if (!editingId || !editingView) return;
    const item = items.current.get(editingId);
    const anchor = editingView === 'group' ? item : (item?.querySelector<HTMLElement>(`[data-segment="${editingView}"]`) ?? item);
    setPlace(anchor ? placeUnder(anchor, editingView === 'group' ? GROUP_POPOVER_WIDTH : VALUE_POPOVER_WIDTH) : null);
  }, [editingId, editingView]);

  const placeInner = useCallback(() => {
    if (!inner) return;
    const pill = popoverRef.current?.querySelector<HTMLElement>(`[data-condition-id="${inner.conditionId}"]`);
    const anchor = pill?.querySelector<HTMLElement>(`[data-segment="${inner.segment}"]`) ?? pill;
    setInnerPlace(anchor ? placeUnder(anchor, VALUE_POPOVER_WIDTH) : null);
  }, [inner]);

  useLayoutEffect(reposition, [reposition, root]);
  useLayoutEffect(placeInner, [placeInner, root, place]);

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
      // Menus and the value popover render in portals of their own.
      if (target.closest('[data-filter-popover], [role="menu"], [role="listbox"]')) return;
      if (popoverRef.current?.contains(target)) {
        // Elsewhere in the group: close the condition's editor (a pressed segment opens its own after).
        setInner(null);
        return;
      }
      if (target.closest('[data-filter-pill]')) return;
      setEditing(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // An open menu closes itself on Escape.
      if (e.key !== 'Escape' || document.querySelector('[role="menu"]')) return;
      // Close one layer, and not a dialog the Bar sits in.
      e.stopPropagation();
      if (inner) setInner(null);
      else setEditing(null);
    };
    const onMove = () => {
      reposition();
      placeInner();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [editingId, inner, reposition, placeInner, setEditing]);

  // A new group gets focus on its "+ Filter", which also marks it as the group being worked in.
  const focusGroupId = useRef<string | null>(null);
  useEffect(() => {
    const id = focusGroupId.current;
    if (!id) return;
    focusGroupId.current = null;
    // After the "+ Filter" menu has returned focus to its own button.
    window.requestAnimationFrame(() =>
      popoverRef.current?.querySelector<HTMLElement>(`[data-group-id="${id}"] [data-add-filter] button`)?.focus(),
    );
  });

  const addCondition = (parentId: string, parameterId: string) => {
    const param = parameters.find((p) => p.id === parameterId);
    const condition = newCondition({ parameterId, operatorId: param ? defaultOperatorFor(param) : undefined });
    // Everything at the top of the popover is a card, so a field added there starts a new card.
    const child = parentId === editingId ? newGroup('and', [condition]) : condition;
    actions.replace(appendChild(root, parentId, child));
    setInner({ conditionId: condition.id, segment: 'value' });
  };

  const addGroup = (parentId: string) => {
    const group = newGroup('and');
    actions.replace(appendChild(root, parentId, group));
    focusGroupId.current = group.id;
    setActiveGroupId(group.id);
  };

  const removeCondition = (id: string) => {
    if (inner?.conditionId === id) setInner(null);
    actions.remove(id);
  };

  if (root.children.length === 0 && !showEmpty) return null;

  const mountedNode = root.children.find((n) => n.id === mounted?.id);
  const mountedLead = mountedNode ? firstCondition(mountedNode) : null;
  const mountedParam = parameters.find((p) => p.id === mountedLead?.parameterId);
  const wide = mounted?.view === 'group';
  const editingNode = root.children.find((n) => n.id === editingId);
  const editingLead = editingNode ? firstCondition(editingNode) : null;
  const innerNode = inner ? findNode(root, inner.conditionId) : null;

  /** A pill with one condition edits its value and operator in place; anything else opens the group. */
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
              if (renderPill) return renderPill({ ...summarizePill(node, parameters), onEdit, onRemove });
              // A filter with no conditions yet is the grey "Advanced filter" pill (Figma 10153:6602).
              return countConditions(node) === 0 ? (
                <FilterPill
                  empty
                  parameter={{ label: 'Advanced filter', icon: 'FunnelSimple' }}
                  onEdit={() => editSegment(node, 'parameter')}
                  onRemove={onRemove}
                  removeLabel="Remove filter"
                />
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
              <FilterBarGroup
                group={mountedNode}
                parameters={parameters}
                categories={fieldGroups}
                activeGroupId={activeGroupId}
                onAddCondition={addCondition}
                onAddGroup={addGroup}
                onRemove={removeCondition}
                onSetOp={actions.setOp}
                onEditCondition={(conditionId, segment) => setInner(segment === 'more' ? null : { conditionId, segment })}
              />
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
      {editing?.view === 'operator' && place && editingLead && (
        <ConditionEditor
          condition={editingLead}
          parameters={parameters}
          segment="operator"
          place={place}
          actions={actions}
          onClose={() => setEditing(null)}
          onNext={(next) => setEditing(next === 'value' ? { id: editing.id, view: 'value' } : null)}
        />
      )}
      {inner && innerPlace && innerNode?.kind === 'condition' && (
        <ConditionEditor
          key={`${inner.conditionId}-${inner.segment}`}
          condition={innerNode}
          parameters={parameters}
          segment={inner.segment}
          place={innerPlace}
          actions={actions}
          onClose={() => setInner(null)}
          onNext={(next) => setInner(next ? { conditionId: innerNode.id, segment: next } : null)}
        />
      )}
    </div>
  );
}
