import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx.js';
import styles from './ModalOverlay.module.css';

export interface ModalOverlayProps {
  open: boolean;
  /** Called on Escape and on a click on the scrim. */
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  /**
   * Names the panel shown. Swapping in another panel while open (a new key) moves focus into it, as on opening,
   * and resizes the card from the old panel's size to the new one's.
   */
  panelKey?: string;
  children: ReactNode;
}

/**
 * ModalOverlay — scrim, centring, focus trap, scroll lock and Escape for the
 * ARS modal panels, which draw their own card.
 */
export function ModalOverlay({ open, onClose, label, panelKey, children }: ModalOverlayProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(open);

  // Keep mounted through the close transition.
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  useFocusTrap(open, dialogRef, onClose);
  usePanelSwap(open && mounted, panelKey, dialogRef);

  if (!mounted) return null;

  return createPortal(
    <div className={cx(styles.scrim, open && styles.scrimOpen)} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cx(styles.dialog, open && styles.dialogOpen)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** The dialog's controls that can take focus now: not in a panel hidden under another, or in an `inert` step. */
function focusables(dialog: HTMLElement, selector = FOCUSABLE_SELECTOR) {
  return Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest('[inert]'),
  );
}

/** The first field, not the header's close button. */
function focusFirst(dialog: HTMLElement | null) {
  if (!dialog) return;
  (focusables(dialog, 'input:not([disabled])')[0] ?? focusables(dialog)[0])?.focus();
}

interface Size {
  width: number;
  height: number;
}

/**
 * A panel swapped in while the dialog shows (a new `panelKey`) gets focus, and the card resizes from the old
 * panel's size to the new one's with the Iris motion tokens. With reduced motion the panels just swap.
 */
function usePanelSwap(shown: boolean, panelKey: string | undefined, dialogRef: RefObject<HTMLElement | null>) {
  // The card's current size: where a resize starts.
  const size = useRef<Size | null>(null);
  // The panel on screen; null while the dialog isn't, so the first panel after opening is not a swap.
  const onScreen = useRef<string | undefined | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!shown || !dialog || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      size.current = { width: dialog.offsetWidth, height: dialog.offsetHeight };
    });
    ro.observe(dialog);
    return () => {
      ro.disconnect();
      size.current = null;
    };
  }, [shown, dialogRef]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!shown || !dialog) {
      onScreen.current = null;
      if (dialog) settle(dialog);
      return undefined;
    }
    const previous = onScreen.current;
    onScreen.current = panelKey;
    if (previous === null || previous === panelKey) return undefined;
    settle(dialog);
    // Before the card clips the panel, so nothing inside it scrolls.
    focusFirst(dialog);
    return resize(dialog, size.current);
  }, [shown, panelKey, dialogRef]);
}

/** Plays the card from `from` to the new panel's own size. Returns a cleanup that stops waiting for the end. */
function resize(dialog: HTMLElement, from: Size | null) {
  if (!from || typeof dialog.getAnimations !== 'function') return undefined;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
  const to: Size = { width: dialog.offsetWidth, height: dialog.offsetHeight };
  if (to.width === from.width && to.height === from.height) return undefined;

  dialog.style.setProperty('--modal-panel-width', `${to.width}px`);
  dialog.style.setProperty('--modal-panel-height', `${to.height}px`);
  dialog.style.width = `${from.width}px`;
  dialog.style.height = `${from.height}px`;
  dialog.classList.add(styles.resizing);
  // Lay out the old size first, so the change to the new one transitions.
  void dialog.offsetWidth;
  dialog.style.width = `${to.width}px`;
  dialog.style.height = `${to.height}px`;

  let current = true;
  void Promise.allSettled(dialog.getAnimations().map((a) => a.finished)).then(() => {
    if (current) settle(dialog);
  });
  return () => {
    current = false;
  };
}

/** Back to the panel's own size, with no resize under way. */
function settle(dialog: HTMLElement) {
  dialog.classList.remove(styles.resizing);
  for (const property of ['width', 'height', '--modal-panel-width', '--modal-panel-height']) {
    dialog.style.removeProperty(property);
  }
}

function useFocusTrap(open: boolean, dialogRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = requestAnimationFrame(() => focusFirst(dialogRef.current));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const list = focusables(dialogRef.current);
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      cancelAnimationFrame(focusTimer);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, dialogRef]);
}
