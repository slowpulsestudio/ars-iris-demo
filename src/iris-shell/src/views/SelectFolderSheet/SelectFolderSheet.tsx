import { useEffect, useMemo, useState } from 'react';
import { ARSDirectoryManagementContent } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { useDirectory } from '../../lib/directoryStore.js';
import type { DirectoryNodeView } from '../../lib/directoryData.js';
import { toTreeNode } from '../../lib/directoryTree.js';

export interface SelectFolderSheetProps {
  open: boolean;
  onClose: () => void;
  /** Names what the folder is for, in the subtitle. */
  objectName: string;
  /** The folder ticked when the sheet opens. */
  initialId: string | null;
  /** Lists only the folders inside this node, e.g. Active Directory for an AD group. */
  rootId?: string;
  onSelect: (id: string) => void;
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
 * SelectFolderSheet — the Select folder side sheet (Figma 1746:14585) a New object form opens from "Select
 * destination folder": browse the directory tree, tick a folder, then Select.
 */
export function SelectFolderSheet({ open, onClose, objectName, initialId, rootId, onSelect }: SelectFolderSheetProps) {
  const { nodeTree, getPath } = useDirectory();
  const [choice, setChoice] = useState<string | null>(initialId);

  useEffect(() => {
    if (open) setChoice(initialId);
  }, [open, initialId]);

  const nodes = useMemo(
    () => (rootId ? (findNode(nodeTree, rootId)?.children ?? []) : nodeTree).map(toTreeNode),
    [nodeTree, rootId],
  );

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      title="Select folder"
      subtitle={`Browse and select a destination folder for ${objectName}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!choice}
            onClick={() => {
              if (choice) onSelect(choice);
              onClose();
            }}
          >
            Select
          </Button>
        </>
      }
    >
      <ARSDirectoryManagementContent
        variant="tree"
        nodes={nodes}
        selectedId={choice}
        onSelect={setChoice}
        defaultExpandedIds={choice ? getPath(choice).map((n) => n.id) : []}
      />
    </SideSheet>
  );
}
