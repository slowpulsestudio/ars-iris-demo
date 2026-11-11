import { useEffect, useState } from 'react';
import { navigate, setNavigationGuard } from './router.js';

/**
 * Holds back leaving a form with unsaved changes. `leave(action)` runs the
 * action now, or after the user confirms; `onDiscard` resets the form first.
 */
export function useLeaveGuard(dirty: boolean, onDiscard: () => void) {
  // What Confirm will do; null = the Unsaved changes modal is closed.
  const [pending, setPending] = useState<{ run: () => void } | null>(null);

  const leave = (action: () => void) => {
    if (dirty) setPending({ run: action });
    else action();
  };

  // Browser navigation (links, Back) is held back too.
  useEffect(() => {
    if (!dirty) return undefined;
    setNavigationGuard((path) => {
      setPending({ run: () => navigate(path) });
      return false;
    });
    return () => setNavigationGuard(null);
  }, [dirty]);

  const confirm = () => {
    const next = pending;
    setNavigationGuard(null);
    setPending(null);
    onDiscard();
    next?.run();
  };

  return { leave, open: pending !== null, confirm, cancel: () => setPending(null) };
}
