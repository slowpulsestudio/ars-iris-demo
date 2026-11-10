import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  ARSADRightClickTreeMenu,
  ARSDirectoryManagementContent,
  ARSDirectoryManagementPanel,
  type ARSDirectoryView,
} from '@ars';
import type { TreeNode } from '../../components/Tree/Tree.js';
import { DIRECTORIES } from '../../components/Sidebar/Sidebar.js';
import { navigate, useRoute } from '../../lib/router.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { ALL_NODE_IDS, type DirectoryNodeView } from '../../lib/directoryData.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { useVertical } from '../../lib/verticals.js';
import {
  ROUTE_TO_SECONDARY_NAV,
  ROUTE_TO_VIEW,
  handleSecondaryNavChange,
  handleViewChange,
} from '../AppShell/AppShell.js';
import styles from './ARSDirectoryPanel.module.css';

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

/** The tree node selected by the current route; `#/tree` itself selects none. */
function selectedNodeId(routeName: string, params: Record<string, string>): string | null {
  return routeName === 'treeList' || routeName === 'treeDetail' ? (params.nodeId ?? null) : null;
}

/**
 * ARSDirectoryPanel — the app's directory panel: ARS_Directory_Management_Panel
 * with the Flat, Tree or Favorites content, bound to the route and the directory data.
 */
export function ARSDirectoryPanel() {
  const route = useRoute();
  const vertical = useVertical();
  const secondary = vertical.secondarySidebar;
  const { nodeTree, getPath, moveNode, canMoveNode } = useDirectory();
  const { entries: favorites } = useFavorites();

  const view = ROUTE_TO_VIEW[route.name] ?? 'flat';
  const selectedId = selectedNodeId(route.name, route.params as Record<string, string>);

  const [directories, setDirectories] = useState<Set<string>>(
    () => new Set(DIRECTORIES.map((d) => d.value)),
  );
  const [favoritesSearch, setFavoritesSearch] = useState('');
  const nodes = useMemo(() => nodeTree.map(toTreeNode), [nodeTree]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(ALL_NODE_IDS));
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Reveal the ancestors of the selected node (deep links and drill-in).
  useEffect(() => {
    if (!selectedId) return;
    const ancestors = getPath(selectedId).map((n) => n.id);
    setExpanded((prev) => new Set([...prev, ...ancestors]));
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
    // Keyboard-invoked context menus report 0,0: anchor to the row instead.
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ x: rect.left, y: rect.bottom });
      return;
    }
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const favoriteSections = useMemo(() => {
    const q = favoritesSearch.trim().toLowerCase();
    const byType = new Map<string, { id: string; label: string; icon: string }[]>();
    for (const f of favorites) {
      if (q && !f.name.toLowerCase().includes(q)) continue;
      byType.set(f.type, [...(byType.get(f.type) ?? []), { id: f.id, label: f.name, icon: 'Star' }]);
    }
    return [...byType].map(([title, items]) => ({ title, items }));
  }, [favorites, favoritesSearch]);

  const content =
    view === 'tree' ? (
      <ARSDirectoryManagementContent
        variant="tree"
        nodes={nodes}
        selectedId={selectedId}
        onSelect={(id) => navigate(`#/tree/${id}`)}
        expandedIds={expanded}
        onExpandedChange={setNodeExpanded}
        onContextMenu={openContextMenu}
        canMove={canMoveNode}
        onMove={(id, targetId) => {
          if (moveNode(id, targetId)) setNodeExpanded(targetId, true);
        }}
      />
    ) : view === 'favourites' ? (
      <ARSDirectoryManagementContent
        variant="favorites"
        sections={favoriteSections}
        search={favoritesSearch}
        onSearchChange={setFavoritesSearch}
        onSelect={(id) => {
          const entry = favorites.find((f) => f.id === id);
          if (entry) navigate(entry.href);
        }}
      />
    ) : (
      <ARSDirectoryManagementContent
        variant="flat"
        items={(secondary?.navItems ?? []).map((n) => ({ id: n.value, label: n.label, icon: n.icon }))}
        selectedId={ROUTE_TO_SECONDARY_NAV[route.name] ?? null}
        onSelect={handleSecondaryNavChange}
      />
    );

  return (
    <>
      <div className={styles.panel}>
        <ARSDirectoryManagementPanel
          view={(view === 'favourites' ? 'favorites' : view) as ARSDirectoryView}
          onViewChange={(v) => handleViewChange(v === 'favorites' ? 'favourites' : v)}
          directories={{
            options: DIRECTORIES,
            selected: directories,
            onSelectionChange: setDirectories,
            label: secondary?.directoryLabel,
          }}
        >
          {content}
        </ARSDirectoryManagementPanel>
      </div>
      <ARSADRightClickTreeMenu
        open={menuPos !== null}
        onOpenChange={(o) => {
          if (!o) setMenuPos(null);
        }}
        position={menuPos ?? undefined}
      />
    </>
  );
}
