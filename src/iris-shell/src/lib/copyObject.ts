import { addObject, getNodePath, getObject, removeObject, type DirectoryObject } from './directoryData.js';

let copies = 0;

/** Copies a leaf object into `toNodeId` as "Copy of …"; `undo` removes the copy again. */
export function copyObject(
  fromNodeId: string,
  objectId: string,
  toNodeId: string,
): { copy: DirectoryObject; undo: () => void } | null {
  const source = getObject(fromNodeId, objectId);
  if (!source || source.isContainer) return null;
  copies += 1;
  const name = `Copy of ${source.name}`;
  const copy: DirectoryObject = {
    ...source,
    id: `${source.id}-copy${copies}`,
    name,
    parentId: toNodeId,
    details: {
      ...source.details,
      displayName: source.details.displayName ? name : source.details.displayName,
      location: getNodePath(toNodeId).map((n) => n.name).join(' / '),
    },
  };
  if (!addObject(toNodeId, copy)) return null;
  return { copy, undo: () => void removeObject(toNodeId, copy.id) };
}
