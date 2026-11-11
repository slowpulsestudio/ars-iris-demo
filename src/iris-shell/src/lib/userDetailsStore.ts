import { useSyncExternalStore } from 'react';

/**
 * userDetailsStore — edits to a user's Contact and Job information, kept for
 * the session. The users and directory data have no such fields, so each is
 * the Figma sample until edited.
 */

const EMPTY: Record<string, string> = Object.freeze({});
const saved = new Map<string, Record<string, string>>();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** The edited values for a user, keyed by lower-case label. */
export function useUserDetailValues(userId: string): Record<string, string> {
  return useSyncExternalStore(
    subscribe,
    () => saved.get(userId) ?? EMPTY,
    () => EMPTY,
  );
}

export function saveUserDetailValues(userId: string, patch: Record<string, string>): void {
  saved.set(userId, { ...(saved.get(userId) ?? {}), ...patch });
  listeners.forEach((l) => l());
}
