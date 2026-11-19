import { useEffect, type RefObject } from 'react';

/** Calls `onClose` on Escape or a pointer press outside every one of `refs`, while `open`. */
export function useOutsideDismiss(open: boolean, refs: Array<RefObject<HTMLElement | null>>, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!refs.some((r) => r.current?.contains(e.target as Node))) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
    // The refs are stable objects; only `open` and the close handler matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);
}
