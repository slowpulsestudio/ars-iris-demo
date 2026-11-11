import { canMoveNode, getParentId, moveNode, moveObject } from './directoryData.js';
import { showToast } from './toastStore.js';

/**
 * The Location a Flat view user shows once moved into the folder at `path`:
 * "Entra" for an Entra directory, else the AD path, e.g. "O1D.local\Test OU\Test1".
 */
export function userLocationFor(path: Array<{ id: string; name: string }>): string {
  if (path.some((n) => n.id === 'entra-directories')) return 'Entra';
  const tier = path.findIndex((n) => n.id === 'active-directories');
  return path.slice(tier + 1).map((n) => n.name).join('\\');
}

/** Shows the "moved" toast; Undo reverses it, and View opens the object (one) or the folder (several). */
export function announceMoved(opts: {
  names: string[];
  /** Object class of a single object, e.g. "User". */
  typeLabel: string;
  destName: string;
  undo: () => void;
  viewHref?: string;
}): void {
  const { names, typeLabel, destName, undo, viewHref } = opts;
  const one = names.length === 1;
  showToast(
    one ? `${typeLabel} ${names[0]} moved to ${destName} successfully.` : `Moved ${names.length} objects to ${destName} successfully.`,
    { onUndo: undo, viewHref, viewLabel: one ? 'View object' : 'View' },
  );
}

/** An object in the Tree view: a leaf inside `nodeId`, or a container (itself a tree node). */
export interface MoveItem {
  id: string;
  /** The node the object sits in now. */
  nodeId: string;
  isContainer: boolean;
}

/** Whether `item` can go into `destId`: not where it already is, and an OU never into itself or its child. */
export function canMoveItem(item: MoveItem, destId: string): boolean {
  return item.isContainer ? canMoveNode(item.id, destId) : item.nodeId !== destId;
}

/** Moves every item that can go to `destId`; `undo` puts each one back where it was. */
export function moveItems(items: MoveItem[], destId: string): { moved: MoveItem[]; undo: () => void } {
  const back: Array<() => void> = [];
  const moved: MoveItem[] = [];
  for (const item of items) {
    if (!canMoveItem(item, destId)) continue;
    if (item.isContainer) {
      const from = getParentId(item.id);
      if (!moveNode(item.id, destId)) continue;
      back.push(() => void moveNode(item.id, from));
    } else {
      const index = moveObject(item.nodeId, item.id, destId);
      if (index === null) continue;
      back.push(() => void moveObject(destId, item.id, item.nodeId, index));
    }
    moved.push(item);
  }
  return { moved, undo: () => back.reverse().forEach((run) => run()) };
}

/** An object to move, with what the toast says about it. */
export interface MoveEntry {
  item: MoveItem;
  name: string;
  /** Object class, e.g. "User". */
  typeLabel: string;
}

/** Moves the entries into `destId` and shows the toast. Returns the items that moved. */
export function moveEntries(entries: MoveEntry[], destId: string, destName: string): MoveItem[] {
  const { moved, undo } = moveItems(entries.map((e) => e.item), destId);
  if (moved.length === 0) return [];
  const done = entries.filter((e) => moved.some((m) => m.id === e.item.id));
  const [only] = moved;
  announceMoved({
    names: done.map((e) => e.name),
    typeLabel: done[0].typeLabel,
    destName,
    undo,
    viewHref: moved.length === 1 && only.isContainer ? `#/tree/${only.id}` : moved.length === 1 ? `#/tree/${destId}/${only.id}` : `#/tree/${destId}`,
  });
  return moved;
}
