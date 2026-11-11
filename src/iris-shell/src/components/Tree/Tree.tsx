import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Icon } from '../Icon/Icon.js';
import styles from './Tree.module.css';

export interface TreeNode {
  id: string;
  label: string;
  /** Leading icon name. */
  icon?: string;
  /** Leading icon while expanded, e.g. an open folder. */
  openIcon?: string;
  children?: TreeNode[];
  /** UI Kit "Trailing Icons"; shown on hover, focus and selection. */
  trailing?: ReactNode;
  /** Draws a divider row above this node. */
  separatorBefore?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];
  ariaLabel: string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Controlled expansion. Omit to let the tree manage it, seeded by defaultExpandedIds. */
  expandedIds?: ReadonlySet<string>;
  defaultExpandedIds?: Iterable<string>;
  onExpandedChange?: (id: string, expanded: boolean) => void;
  /** UI Kit "Checkbox=ON" leading icon. */
  checkedIds?: ReadonlySet<string>;
  onCheckedChange?: (id: string, checked: boolean) => void;
  onContextMenu?: (id: string, event: MouseEvent<HTMLElement>) => void;
  /** Enables drag and drop: dropping a row onto another calls onMove. */
  onMove?: (id: string, targetId: string) => void;
  canMove?: (id: string, targetId: string) => boolean;
  /** Data type carried by things dragged in from outside the tree (e.g. table rows); drops of it call onExternalDrop. */
  externalDropType?: string;
  canExternalDrop?: (targetId: string) => boolean;
  onExternalDrop?: (targetId: string) => void;
  className?: string;
}

type TrailPiece = 'line' | 'tee' | 'end';

const TRAIL_CLASS: Record<TrailPiece, string> = {
  line: styles.trailLine,
  tee: styles.trailTee,
  end: styles.trailEnd,
};

interface Row {
  node: TreeNode;
  level: number;
  parentId: string | null;
  /** One .Tree-Trail piece per level. */
  trail: TrailPiece[];
}

function flatten(nodes: TreeNode[], expanded: ReadonlySet<string>): Row[] {
  const rows: Row[] = [];
  const walk = (list: TreeNode[], level: number, parentId: string | null) => {
    for (const node of list) {
      rows.push({ node, level, parentId, trail: [] });
      if (node.children?.length && expanded.has(node.id)) walk(node.children, level + 1, node.id);
    }
  };
  walk(nodes, 0, null);
  // A column's line continues while the next row is still inside that column's branch.
  rows.forEach((row, i) => {
    const nextLevel = rows[i + 1]?.level ?? 0;
    for (let k = 1; k <= row.level; k++) {
      row.trail.push(nextLevel >= k ? (k === row.level ? 'tee' : 'line') : 'end');
    }
  });
  return rows;
}

/**
 * Tree — hierarchical list matching the Iris UI Kit "Tree" (Component / Tree):
 * 24px rows with trail lines, caret, optional checkbox and icon, text and
 * trailing icons. Keyboard support follows the WAI-ARIA tree pattern.
 */
export function Tree({
  nodes,
  ariaLabel,
  selectedId = null,
  onSelect,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  checkedIds,
  onCheckedChange,
  onContextMenu,
  onMove,
  canMove,
  externalDropType,
  canExternalDrop,
  onExternalDrop,
  className,
}: TreeProps) {
  const [ownExpanded, setOwnExpanded] = useState<ReadonlySet<string>>(() => new Set(defaultExpandedIds));
  const expanded = expandedIds ?? ownExpanded;
  const rows = useMemo(() => flatten(nodes, expanded), [nodes, expanded]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  // A closed folder opens once an outside drag has rested on it for a moment.
  const expandTimer = useRef<{ id: string; timer: number } | null>(null);

  const clearExpandTimer = () => {
    if (expandTimer.current) window.clearTimeout(expandTimer.current.timer);
    expandTimer.current = null;
  };
  useEffect(() => clearExpandTimer, []);
  const isExternalDrag = (e: DragEvent) =>
    !!externalDropType && Array.from(e.dataTransfer.types).includes(externalDropType);

  const tabStopId =
    (focusedId && rows.some((r) => r.node.id === focusedId) && focusedId) ||
    (selectedId && rows.some((r) => r.node.id === selectedId) && selectedId) ||
    rows[0]?.node.id;

  const setExpanded = (id: string, next: boolean) => {
    if (!expandedIds) {
      setOwnExpanded((prev) => {
        const copy = new Set(prev);
        if (next) copy.add(id);
        else copy.delete(id);
        return copy;
      });
    }
    onExpandedChange?.(id, next);
  };

  const focusRow = (id: string) => {
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  };

  const endDrag = () => {
    clearExpandTimer();
    setDraggingId(null);
    setDropTargetId(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    const row = rows[index];
    const hasChildren = !!row.node.children?.length;
    const isOpen = expanded.has(row.node.id);
    switch (event.key) {
      case 'ArrowDown':
        if (index < rows.length - 1) focusRow(rows[index + 1].node.id);
        break;
      case 'ArrowUp':
        if (index > 0) focusRow(rows[index - 1].node.id);
        break;
      case 'ArrowRight':
        if (hasChildren && !isOpen) setExpanded(row.node.id, true);
        else if (hasChildren) focusRow(rows[index + 1].node.id);
        break;
      case 'ArrowLeft':
        if (hasChildren && isOpen) setExpanded(row.node.id, false);
        else if (row.parentId) focusRow(row.parentId);
        break;
      case 'Home':
        focusRow(rows[0].node.id);
        break;
      case 'End':
        focusRow(rows[rows.length - 1].node.id);
        break;
      case ' ':
        if (onCheckedChange) {
          onCheckedChange(row.node.id, !checkedIds?.has(row.node.id));
          break;
        }
        onSelect?.(row.node.id);
        break;
      case 'Enter':
        onSelect?.(row.node.id);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <ul role="tree" aria-label={ariaLabel} className={cx(styles.tree, className)}>
      {rows.flatMap((row, index) => {
        const { node, level } = row;
        const hasChildren = !!node.children?.length;
        const isOpen = hasChildren && expanded.has(node.id);
        const isSelected = node.id === selectedId;
        const icon = isOpen ? (node.openIcon ?? node.icon) : node.icon;
        return [
          node.separatorBefore && (
            <li key={`${node.id}-separator`} role="separator" className={styles.separator} />
          ),
          <TreeRow
            key={node.id}
            selected={isSelected}
            rowRef={(el) => {
              if (el) rowRefs.current.set(node.id, el);
              else rowRefs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level + 1}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={isSelected}
            aria-checked={onCheckedChange ? (checkedIds?.has(node.id) ?? false) : undefined}
            tabIndex={node.id === tabStopId ? 0 : -1}
            className={cx(
              styles.row,
              isSelected && styles.selected,
              node.id === draggingId && styles.dragging,
              node.id === dropTargetId && styles.dropTarget,
            )}
            onClick={() => {
              setFocusedId(node.id);
              onSelect?.(node.id);
            }}
            onKeyDown={(e) => onKeyDown(e, index)}
            onContextMenu={onContextMenu && ((e) => onContextMenu(node.id, e))}
            draggable={!!onMove}
            onDragStart={
              onMove &&
              ((e) => {
                e.dataTransfer.setData('text/plain', node.id);
                e.dataTransfer.effectAllowed = 'move';
                setDraggingId(node.id);
              })
            }
            onDragEnd={onMove && endDrag}
            onDragOver={
              (onMove || onExternalDrop) &&
              ((e) => {
                if (isExternalDrag(e)) {
                  if (canExternalDrop?.(node.id) === false) {
                    e.dataTransfer.dropEffect = 'none';
                    if (dropTargetId === node.id) setDropTargetId(null);
                    return;
                  }
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dropTargetId !== node.id) setDropTargetId(node.id);
                  if (!hasChildren || isOpen) clearExpandTimer();
                  else if (expandTimer.current?.id !== node.id) {
                    clearExpandTimer();
                    expandTimer.current = { id: node.id, timer: window.setTimeout(() => setExpanded(node.id, true), 600) };
                  }
                  return;
                }
                if (!draggingId) return;
                if (draggingId === node.id || canMove?.(draggingId, node.id) === false) {
                  e.dataTransfer.dropEffect = 'none';
                  if (dropTargetId === node.id) setDropTargetId(null);
                  return;
                }
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dropTargetId !== node.id) setDropTargetId(node.id);
              })
            }
            onDragLeave={
              onExternalDrop &&
              ((e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                if (expandTimer.current?.id === node.id) clearExpandTimer();
                if (dropTargetId === node.id) setDropTargetId(null);
              })
            }
            onDrop={
              (onMove || onExternalDrop) &&
              ((e) => {
                if (isExternalDrag(e)) {
                  e.preventDefault();
                  if (canExternalDrop?.(node.id) !== false) onExternalDrop?.(node.id);
                  endDrag();
                  return;
                }
                e.preventDefault();
                const sourceId = draggingId ?? e.dataTransfer.getData('text/plain');
                if (sourceId && sourceId !== node.id) onMove?.(sourceId, node.id);
                endDrag();
              })
            }
          >
            {level > 0 && (
              <span className={styles.trailZone} aria-hidden="true">
                {row.trail.map((piece, i) => (
                  <span key={i} className={cx(styles.trail, TRAIL_CLASS[piece])} />
                ))}
              </span>
            )}
            <span className={styles.leading}>
              <span
                className={styles.caret}
                aria-hidden="true"
                onClick={(e) => {
                  if (!hasChildren) return;
                  e.stopPropagation();
                  setExpanded(node.id, !isOpen);
                }}
              >
                {hasChildren && <Icon name={isOpen ? 'CaretDown' : 'CaretRight'} size="8px" />}
              </span>
              {onCheckedChange && (
                <span className={styles.check} aria-hidden="true" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    size="small"
                    tabIndex={-1}
                    checked={checkedIds?.has(node.id) ?? false}
                    onChange={(checked) => onCheckedChange(node.id, checked)}
                  />
                </span>
              )}
              {icon && <Icon name={icon} size="16px" />}
            </span>
            <span className={styles.text} title={node.label}>
              {node.label}
            </span>
            {node.trailing && <span className={styles.trailing}>{node.trailing}</span>}
          </TreeRow>,
        ];
      })}
    </ul>
  );
}

interface TreeRowProps extends LiHTMLAttributes<HTMLLIElement> {
  selected: boolean;
  rowRef: (el: HTMLLIElement | null) => void;
}

function TreeRow({ selected, rowRef, ...rest }: TreeRowProps) {
  const ref = useRef<HTMLLIElement | null>(null);

  // Reveal the selected row, including on deep-link arrival once its ancestors expand.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <li
      ref={(el) => {
        ref.current = el;
        rowRef(el);
      }}
      {...rest}
    />
  );
}
