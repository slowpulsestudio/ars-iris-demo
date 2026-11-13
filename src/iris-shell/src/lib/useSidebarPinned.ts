import { useCallback, useEffect, useState } from 'react';

// Renamed from 'ars.globalSidebar.pinnedOpen' when each persona got its own default (David and Werner start
// closed); one key per persona, so switching persona doesn't carry the other's choice over.
const STORAGE_PREFIX = 'ars.globalSidebar.open.';

/** The saved choice for this key, or null when the user hasn't opened or closed the sidebar yet. */
function readSaved(key: string): boolean | null {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? null : saved === '1';
  } catch {
    return null;
  }
}

export type SetPinned = (next: boolean | ((prev: boolean) => boolean)) => void;

/**
 * useSidebarPinned — persists the global sidebar's pinned/expanded state
 * across page navigations and reloads (per-browser, via localStorage), per
 * persona. `scope` is the persona id; `defaultPinned` applies until the user
 * opens or closes the sidebar, and only their choice is saved.
 *
 * Returns a `[pinned, setPinned]` tuple. `setPinned` accepts either a boolean
 * or an updater function, matching React's `useState` ergonomics.
 */
export function useSidebarPinned(scope: string, defaultPinned: boolean): [boolean, SetPinned] {
  const key = `${STORAGE_PREFIX}${scope}`;
  const [chosen, setChosen] = useState<Record<string, boolean>>({});
  const pinned = chosen[key] ?? readSaved(key) ?? defaultPinned;

  useEffect(() => {
    try {
      for (const [k, value] of Object.entries(chosen)) localStorage.setItem(k, value ? '1' : '0');
    } catch {
      /* storage unavailable — silently ignore */
    }
  }, [chosen]);

  const setPinned: SetPinned = useCallback(
    (next) => {
      setChosen((prev) => {
        const current = prev[key] ?? readSaved(key) ?? defaultPinned;
        return { ...prev, [key]: typeof next === 'function' ? next(current) : next };
      });
    },
    [key, defaultPinned],
  );

  return [pinned, setPinned];
}
