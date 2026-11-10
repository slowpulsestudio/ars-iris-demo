import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Icon } from '../Icon/Icon.js';
import styles from './Tree.module.css';

export interface TreeNode {
  id: string;
  label: string;
  /** Leading icon name; defaults to Folder / FolderOpen. Pass null for none. */
  icon?: string | null;
  openIcon?: string;
  children?: TreeNode[];
  /** UI Kit "Trailing Icons" (e.g. more / caret); shown on hover, focus and selection. */
  trailing?: ReactNode;
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
  className?: string;
}

interface Row {
  node: TreeNode;
  level: number;
  parentId: string | null;
  /** Per ancestor column: does that ancestor's line continue below this row? */
  guides: boolean[];
  isLast: boolean;
}

function flatten(nodes: TreeNode[], expanded: ReadonlySet<string>): Row[] {
  const rows: Row[] = [];
  const walk = (list: TreeNode[], level: number, parentId: string | null, guides: boolean[]) => {
    list.forEach((node, i) => {
      const isLast = i === list.length - 1;
      rows.push({ node, level, parentId, guides, isLast });
      if (node.children?.length && expanded.has(node.id)) {
        walk(node.children, level + 1, node.id, level === 0 ? [] : [...guides, !isLast]);
      }
    });
  };
  walk(nodes, 0, null, []);
  return rows;
}

/**
 * Tree — hierarchical list matching the Iris UI Kit "Tree" (Component / Tree):
 * 24px rows with trail lines, caret, optional checkbox and folder icon, text
 * and trailing icons. Keyboard support follows the WAI-ARIA tree pattern.
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
  className,
}: TreeProps) {
  const [ownExpanded, setOwnExpanded] = useState<ReadonlySet<string>>(() => new Set(defaultExpandedIds));
  const expanded = expandedIds ?? ownExpanded;
  const rows = useMemo(() => flatten(nodes, expanded), [nodes, expanded]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());

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
      {rows.map((row, index) => {
        const { node, level } = row;
        const hasChildren = !!node.children?.length;
        const isOpen = hasChildren && expanded.has(node.id);
        const isSelected = node.id === selectedId;
        const icon = node.icon === null ? null : isOpen ? (node.openIcon ?? 'FolderOpen') : (node.icon ?? 'Folder');
        return (
          <li
            key={node.id}
            ref={(el) => {
              if (el) rowRefs.current.set(node.id, el);
              else rowRefs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level + 1}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={isSelected}
            aria-checked={onCheckedChange ? (checkedIds?.has(node.id) ?? false) : undefined}
            tabIndex={node.id === tabStopId ? 0 : -1}
            className={cx(styles.row, isSelected && styles.selected)}
            onClick={() => {
              setFocusedId(node.id);
              onSelect?.(node.id);
            }}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {level > 0 && (
              <span className={styles.trailZone} aria-hidden="true">
                {row.guides.map((continues, i) => (
                  <span key={i} className={cx(styles.trail, continues && styles.trailLine)} />
                ))}
                <span className={cx(styles.trail, row.isLast ? styles.trailEnd : styles.trailTee)} />
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
              {icon && <Icon name={icon} size="16px" className={styles.icon} />}
            </span>
            <span className={styles.text} title={node.label}>
              {node.label}
            </span>
            {node.trailing && <span className={styles.trailing}>{node.trailing}</span>}
          </li>
        );
      })}
    </ul>
  );
}
