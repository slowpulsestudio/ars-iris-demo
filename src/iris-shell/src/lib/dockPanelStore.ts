import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';

/**
 * dockPanelStore — the panel docked beside the main surface (the Advanced filter Panel).
 * A list screen publishes its panel while it is mounted; AppShell draws it beside the list,
 * which narrows to make room, as in the Figma Advanced Search examples.
 */

interface Dock {
  element: ReactNode;
  open: boolean;
}

let dock: Dock | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Publishes a panel to dock while the calling screen is mounted. `undefined` leaves the dock to someone else. */
export function usePublishDockPanel(next: Dock | undefined): void {
  const published = useRef(false);
  useEffect(() => {
    if (next === undefined) return;
    published.current = true;
    dock = next;
    emit();
  });
  useEffect(
    () => () => {
      if (!published.current) return;
      dock = null;
      emit();
    },
    [],
  );
}

/** The docked panel, if a screen has published one. */
export function useDockPanel(): Dock | null {
  return useSyncExternalStore(subscribe, () => dock);
}
