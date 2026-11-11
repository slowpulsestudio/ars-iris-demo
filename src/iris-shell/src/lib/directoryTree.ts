import type { TreeNode } from '../components/Tree/Tree.js';
import type { DirectoryNodeView } from './directoryData.js';

/** A directory node shaped for the Iris Tree, as the ARS directory panel and the folder pickers draw it. */
export function toTreeNode(node: DirectoryNodeView): TreeNode {
  return {
    id: node.id,
    label: node.name,
    icon: node.icon ?? 'Folder',
    openIcon: node.icon ?? 'FolderOpen',
    children: node.children.map(toTreeNode),
    separatorBefore: node.id === 'managed-directories',
  };
}
