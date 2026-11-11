import type { DragEvent } from 'react';
import type { MoveEntry } from './moveObjects.js';

/** Data type set on a drag of directory objects, so the tree knows to accept it. */
export const OBJECT_DRAG_TYPE = 'application/x-ars-objects';

// The drag payload can't be read until the drop, so the dragged objects wait here.
let current: MoveEntry[] | null = null;

export function startObjectDrag(entries: MoveEntry[], event: DragEvent): void {
  current = entries;
  event.dataTransfer.setData(OBJECT_DRAG_TYPE, JSON.stringify(entries.map((e) => e.item.id)));
  event.dataTransfer.effectAllowed = 'move';
}

export function getObjectDrag(): MoveEntry[] | null {
  return current;
}

export function endObjectDrag(): void {
  current = null;
}
