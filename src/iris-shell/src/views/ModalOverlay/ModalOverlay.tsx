import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx.js';
import styles from './ModalOverlay.module.css';

export interface ModalOverlayProps {
  open: boolean;
  /** Called on Escape and on a click on the scrim. */
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  children: ReactNode;
}

/**
 * ModalOverlay — scrim, centring, focus trap, scroll lock and Escape for the
 * ARS modal panels, which draw their own card.
 */
export function ModalOverlay({ open, onClose, label, children }: ModalOverlayProps) {
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

    // The first field, not the header's close button.
    const focusTimer = requestAnimationFrame(() => {
      const target =
        dialogRef.current?.querySelector<HTMLElement>('input:not([disabled])') ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      target?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
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
