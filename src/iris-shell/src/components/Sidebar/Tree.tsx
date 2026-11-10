import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { navigate, useRoute } from '../../lib/router.js';
import { useDirectory } from '../../lib/directoryStore.js';
import {
  ALL_NODE_IDS,
  FIRST_NODE_ID,
  type DirectoryNodeView,
} from '../../lib/directoryData.js';
import { Menu, type MenuEntry } from '../Menu/Menu.js';
import { Tree as IrisTree, type TreeNode } from '../Tree/Tree.js';
import styles from './Tree.module.css';

// Object types offered under the context menu's "Create" submenu. Mirrors
// the Users page "Create" button options.
const CREATE_ITEMS: MenuEntry[] = [
  { kind: 'item', label: 'User', icon: 'User' },
  { kind: 'item', label: 'Group', icon: 'UsersThree' },
  { kind: 'divider' },
  { kind: 'item', label: 'Computer', icon: 'Devices' },
  { kind: 'divider' },
  { kind: 'item', label: 'Organizational Unit', icon: 'FolderPlus' },
  { kind: 'item', label: 'Shared Folder', icon: 'Folders' },
  { kind: 'divider' },
  { kind: 'item', label: 'Contact', icon: 'AddressBook' },
  { kind: 'item', label: 'Group Management Service Account', icon: 'UserCircle' },
];

// Right-click context menu for a directory tree item.
const CONTEXT_ITEMS: MenuEntry[] = [
  { kind: 'submenu', label: 'Create', icon: 'Plus', items: CREATE_ITEMS },
  { kind: 'item', label: 'View properties', icon: 'UserList' },
  { kind: 'item', label: 'Move', icon: 'Folder' },
  { kind: 'item', label: 'Add to Favorites', icon: 'Heart' },
  { kind: 'divider' },
  { kind: 'item', label: 'Delete', icon: 'Trash', danger: true },
];

/** The tree node id (if any) selected by the current route. */
function selectedNodeId(routeName: string, params: Record<string, string>): string | null {
  if (routeName === 'treeList' || routeName === 'treeDetail') return params.nodeId ?? null;
  // `#/tree` has no node in the URL but lands on the first node's listing, so
  // reflect that as the selected item.
  if (routeName === 'treeRoot') return FIRST_NODE_ID;
  return null;
}

function toTreeNode(node: DirectoryNodeView): TreeNode {
  return {
    id: node.id,
    label: node.name,
    icon: node.icon ?? 'Folder',
    openIcon: node.icon ?? 'FolderOpen',
    children: node.children.map(toTreeNode),
    separatorBefore: node.id === 'managed-directories',
  };
}

/**
 * Tree — the sidebar's "Tree view" (ARS_Directory_Management_Content), built
 * on the Iris Tree and fed by `useDirectory()`. Clicking a node opens its
 * listing (`#/tree/:nodeId`); the selected node and its expanded ancestors
 * come from the route, so deep links and drill-in stay in sync.
 */
export function Tree() {
  const { nodeTree, getPath, moveNode, canMoveNode } = useDirectory();
  const route = useRoute();
  const selectedId = selectedNodeId(route.name, route.params as Record<string, string>);
  const nodes = useMemo(() => nodeTree.map(toTreeNode), [nodeTree]);

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  // Fully unfurled by default; users can still collapse individual nodes.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(ALL_NODE_IDS));

  // Auto-expand the ancestors of the selected node (deep-link + drill-in).
  useEffect(() => {
    if (!selectedId) return;
    const ancestors = getPath(selectedId).map((n) => n.id);
    setExpanded((prev) => {
      const next = new Set(prev);
      ancestors.forEach((id) => next.add(id));
      return next;
    });
  }, [selectedId, getPath]);

  const setNodeExpanded = (id: string, open: boolean) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  const openContextMenu = (_id: string, e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // Keyboard-invoked context menus (ContextMenu key / Shift+F10) report 0,0: anchor to the row instead.
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ x: rect.left, y: rect.bottom });
      return;
    }
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div className={styles.scroller}>
        <IrisTree
          nodes={nodes}
          ariaLabel="Directory tree"
          className={styles.tree}
          selectedId={selectedId}
          onSelect={(id) => navigate(`#/tree/${id}`)}
          expandedIds={expanded}
          onExpandedChange={setNodeExpanded}
          onContextMenu={openContextMenu}
          canMove={canMoveNode}
          onMove={(id, targetId) => {
            // Reveal the moved node under its new parent.
            if (moveNode(id, targetId)) setNodeExpanded(targetId, true);
          }}
        />
      </div>
      <Menu
        ariaLabel="Directory item actions"
        items={CONTEXT_ITEMS}
        open={menuPos !== null}
        onOpenChange={(o) => {
          if (!o) setMenuPos(null);
        }}
        position={menuPos ?? undefined}
      />
    </>
  );
}
