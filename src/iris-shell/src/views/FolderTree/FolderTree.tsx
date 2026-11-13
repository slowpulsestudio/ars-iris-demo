import { useMemo } from 'react';
import { ARSDirectoryManagementContent } from '@ars';
import { useDirectory } from '../../lib/directoryStore.js';
import type { DirectoryNodeView } from '../../lib/directoryData.js';
import { toTreeNode } from '../../lib/directoryTree.js';

export interface FolderTreeProps {
  /** The ticked folder; the tree opens at it. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Lists only the folders inside this node, e.g. Active Directory for an AD group. */
  rootId?: string;
}

function findNode(nodes: DirectoryNodeView[], id: string): DirectoryNodeView | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * FolderTree — the directory tree a new object's destination folder is ticked in: the body of the Select
 * folder sheet (New User) and the group forms' Destination folder step.
 */
export function FolderTree({ selectedId, onSelect, rootId }: FolderTreeProps) {
  const { nodeTree, getPath } = useDirectory();

  const nodes = useMemo(
    () => (rootId ? (findNode(nodeTree, rootId)?.children ?? []) : nodeTree).map(toTreeNode),
    [nodeTree, rootId],
  );

  return (
    <ARSDirectoryManagementContent
      variant="tree"
      nodes={nodes}
      selectedId={selectedId}
      onSelect={onSelect}
      defaultExpandedIds={selectedId ? getPath(selectedId).map((n) => n.id) : []}
    />
  );
}
