import { useSyncExternalStore } from 'react';

/**
 * sideSheetStore — how many side sheets are on screen, so the other floating
 * layers (the action bar) can step aside: only one hovering layer at a time.
 * A side sheet registers while it is mounted, which includes its exit, so the
 * layers take turns instead of overlapping.
 */

let count = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Marks a side sheet as on screen; the returned function marks it gone. */
export function registerSideSheet(): () => void {
  count += 1;
  emit();
  let done = false;
  return () => {
    if (done) return;
    done = true;
    count -= 1;
    emit();
  };
}

/** Whether any side sheet is on screen. */
export function useSideSheetOpen(): boolean {
  return useSyncExternalStore(subscribe, () => count > 0);
}
