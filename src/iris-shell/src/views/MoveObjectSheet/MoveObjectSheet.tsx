import { useEffect, useMemo, useRef, useState } from 'react';
import { ARSDirectoryManagementContent, ARSSelectedObjectsBlock, FolderArrowRightIcon } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { toTreeNode } from '../../lib/directoryTree.js';
import styles from './MoveObjectSheet.module.css';

export interface MoveObjectSheetObject {
  id: string;
  name: string;
}

export interface MoveObjectSheetProps {
  open: boolean;
  onClose: () => void;
  /** The objects being moved; one gets its own title, several get the removable list. */
  objects: MoveObjectSheetObject[];
  /** Object class of a single object, e.g. "User". Drives the title. */
  objectType?: string;
  /** Folder to open the tree at (the objects' current folder). */
  currentNodeId?: string | null;
  /** Whether `destId` can take every object; Move stays disabled otherwise. */
  canMoveTo: (destId: string) => boolean;
  /** Called with the chosen folder and the objects left in the list. */
  onMove: (destId: string, objects: MoveObjectSheetObject[]) => void;
}

/**
 * MoveObjectSheet — the Move object / Move Objects side sheet: browse the
 * directory tree, choose a destination folder, then Move. Figma:
 * ARS_WebUI2_Move_Browse_Objects, Move object 2381:17307 and Sidesheet 2290:68343.
 */
export function MoveObjectSheet({
  open,
  onClose,
  objects: given,
  objectType: givenType,
  currentNodeId = null,
  canMoveTo,
  onMove,
}: MoveObjectSheetProps) {
  const { nodeTree, getPath } = useDirectory();
  const [choice, setChoice] = useState<string | null>(null);
  const [removed, setRemoved] = useState<ReadonlySet<string>>(() => new Set());

  // The caller clears `objects` on close; keep the last ones while the sheet slides out.
  const lastObjects = useRef(given);
  if (given.length > 0) lastObjects.current = given;
  const objects = given.length > 0 ? given : lastObjects.current;
  const lastType = useRef(givenType);
  if (givenType) lastType.current = givenType;
  const objectType = givenType ?? lastType.current ?? 'Object';

  // Start fresh each time the sheet opens.
  useEffect(() => {
    if (open) {
      setChoice(null);
      setRemoved(new Set());
    }
  }, [open]);

  const nodes = useMemo(() => nodeTree.map(toTreeNode), [nodeTree]);
  const remaining = objects.filter((o) => !removed.has(o.id));
  const several = objects.length > 1;
  const ready = !!choice && remaining.length > 0 && canMoveTo(choice);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      icon={<FolderArrowRightIcon />}
      title={several ? 'Move Objects' : `Move ${objectType}`}
      subtitle={
        several
          ? 'Browse and choose a destination folder'
          : `Browse and select a destination folder for ${objects[0]?.name ?? 'this object'}`
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!ready} onClick={() => choice && onMove(choice, remaining)}>
            Move
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <ARSDirectoryManagementContent
          variant="tree"
          nodes={nodes}
          selectedId={choice}
          onSelect={setChoice}
          defaultExpandedIds={currentNodeId ? getPath(currentNodeId).map((n) => n.id) : []}
        />
        {several && (
          <ARSSelectedObjectsBlock
            items={remaining.map((o) => ({ id: o.id, label: o.name }))}
            onRemove={(id) => setRemoved((prev) => new Set(prev).add(id))}
          />
        )}
      </div>
    </SideSheet>
  );
}
