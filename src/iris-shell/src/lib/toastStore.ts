import { useCallback, useSyncExternalStore } from 'react';

/**
 * toastStore — a global, app-wide transient toast message. Any code can call
 * `showToast(message)` (e.g. favourites toggles from row/detail menus); a
 * single `<Toast>` rendered in `App` subscribes and displays it.
 *
 * The `Toast` component owns its own auto-dismiss timer, so this store only
 * holds the current toast and a `dismiss` to clear it.
 */

export interface ToastOptions {
  supportingText?: string;
  /** When set, the toast offers a View button that opens this route. */
  viewHref?: string;
}

interface CurrentToast extends ToastOptions {
  message: string;
}

let current: CurrentToast | null = null;
// Kept after dismissal so the toast keeps its type while it animates out.
let last: CurrentToast | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/** Show a toast from anywhere in the app. */
export function showToast(message: string, options: ToastOptions = {}): void {
  current = { message, ...options };
  last = current;
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export interface ToastController {
  message: string | null;
  supportingText?: string;
  viewHref?: string;
  dismiss: () => void;
}

export function useToastMessage(): ToastController {
  const toast = useSyncExternalStore(subscribe, () => current);
  const dismiss = useCallback(() => {
    current = null;
    emit();
  }, []);
  return { message: toast?.message ?? null, supportingText: last?.supportingText, viewHref: last?.viewHref, dismiss };
}
