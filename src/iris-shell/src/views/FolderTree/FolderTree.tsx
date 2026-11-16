import { useMemo } from 'react';
import { ARSDirectoryManagementContent } from '@ars';
import { useDirectory } from '../../lib/directoryStore.js';
import type { DirectoryNodeView } from '../../lib/directoryData.js';
import { toTreeNode } from '../../lib/directoryTree.js';

const MANAGED_DIRECTORIES = 'managed-directories';
const ACTIVE_DIRECTORY = 'active-directories';

export interface FolderTreeProps {
  /** The ticked folder. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** The folder the tree opens at; the ticked folder unless given. */
  openAtId?: string | null;
  /** Lists Managed directories with Active Directory only, as the Select folder step draws them (Figma 3651:20427). */
  activeDirectoryOnly?: boolean;
  /** No padding round the tree, as in the Select folder step's box (Figma 3651:20427). */
  flush?: boolean;
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
 * folder sheet and of the Select folder step (New AD User, New AD Group).
 */
export function FolderTree({
  selectedId,
  onSelect,
  openAtId = selectedId,
  activeDirectoryOnly = false,
  flush,
}: FolderTreeProps) {
  const { nodeTree, getPath } = useDirectory();

  const nodes = useMemo(() => {
    if (!activeDirectoryOnly) return nodeTree.map(toTreeNode);
    // No Access templates, Managed units or Entra ID, so no divider above Managed directories either.
    const managed = findNode(nodeTree, MANAGED_DIRECTORIES);
    const ad = managed ? findNode(managed.children, ACTIVE_DIRECTORY) : null;
    return managed && ad ? [{ ...toTreeNode(managed), separatorBefore: false, children: [toTreeNode(ad)] }] : [];
  }, [nodeTree, activeDirectoryOnly]);

  // Opens at the folder; with none (a new user from the Users list), at Active Directory's domains.
  const expandedIds = openAtId
    ? getPath(openAtId).map((n) => n.id)
    : activeDirectoryOnly
      ? [MANAGED_DIRECTORIES, ACTIVE_DIRECTORY]
      : [];

  return (
    <ARSDirectoryManagementContent
      variant="tree"
      nodes={nodes}
      selectedId={selectedId}
      onSelect={onSelect}
      defaultExpandedIds={expandedIds}
      flush={flush}
    />
  );
}
