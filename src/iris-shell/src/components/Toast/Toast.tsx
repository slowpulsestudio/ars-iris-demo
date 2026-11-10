import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx.js';
import { motionDurationMs, prefersReducedMotion } from '../../lib/motion.js';
import { Icon } from '../Icon/Icon.js';
import { IconButton } from '../IconButton/IconButton.js';
import styles from './Toast.module.css';

export type ToastTone = 'info' | 'warning' | 'error' | 'success';

const TONE_ICONS: Record<ToastTone, string> = {
  info: 'Info',
  warning: 'Warning',
  error: 'WarningCircle',
  success: 'CheckCircle',
};

export interface ToastProps {
  /** The toast's title. Truthy = visible. Setting a new message resets the auto-dismiss timer. */
  message: string | null;
  /** Called when the auto-dismiss timer fires or the user clicks the dismiss
   *  button. Owner clears its own `message` state in response. */
  onDismiss: () => void;
  /** Iris UI Kit "Type". */
  tone?: ToastTone;
  /** Featured icon name; defaults to the tone's icon. */
  icon?: string;
  supportingText?: string;
  /** Up to one action, e.g. a small secondary Button (UI Kit "Actions"). */
  actions?: ReactNode;
  /** Auto-dismiss delay in ms (UI Kit: 5 seconds). */
  durationMs?: number;
}

/**
 * Toast — bottom-right status notification matching the Iris UI Kit "Toast"
 * (Component / Toast): featured icon, title, optional supporting text and
 * action, dismiss X. The countdown pauses on hover or keyboard focus.
 *
 * Controlled: the parent owns the message string and clears it when
 * `onDismiss` fires. A new non-null `message` resets the timer, so a
 * second toast within `durationMs` replaces the first.
 *
 * Rendered through a portal at `document.body` so it floats above the
 * AI panel, modals, and side sheets without inheriting their stacking
 * context.
 */
export function Toast({
  message,
  onDismiss,
  tone = 'success',
  icon,
  supportingText,
  actions,
  durationMs = 5000,
}: ToastProps) {
  // Two-stage state so the leave transition has time to play after the
  // owner clears `message`. `shown` holds the last non-null text and is
  // cleared on a short delay after the prop goes null.
  const [shown, setShown] = useState<string | null>(null);
  // Drives `data-visible`. Held false on the first committed frame so the
  // rise-from-below enter transition actually plays (a node mounted directly
  // in its final state animates nothing) — flipped true on the next frame.
  const [visible, setVisible] = useState(false);

  // Stash `onDismiss` in a ref so the auto-dismiss effect doesn't depend
  // on it. Owners commonly pass an inline arrow (e.g. `() => setX(null)`)
  // which is a fresh reference each render — if it were in the deps, every
  // parent re-render would re-arm the timer, and the toast could outlive
  // its `durationMs` indefinitely (e.g. while a stream ticker keeps
  // re-rendering the parent at ~30ms intervals).
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Pausable countdown: hover or keyboard focus holds it; it resumes (not resets) when both end.
  const timerRef = useRef<number | undefined>(undefined);
  const startedRef = useRef(0);
  const remainingRef = useRef(durationMs);
  const holdRef = useRef({ hover: false, focus: false });

  const startTimer = useCallback(() => {
    if (timerRef.current !== undefined) return;
    startedRef.current = Date.now();
    timerRef.current = window.setTimeout(() => onDismissRef.current(), remainingRef.current);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current === undefined) return;
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    remainingRef.current -= Date.now() - startedRef.current;
  }, []);

  const hold = (key: 'hover' | 'focus', on: boolean) => {
    holdRef.current[key] = on;
    if (on) stopTimer();
    else if (!holdRef.current.hover && !holdRef.current.focus && message) startTimer();
  };

  useEffect(() => {
    if (!message) return;
    setShown(message);
    // Flip to visible on the next frame so the enter transition runs from
    // the resting (below + faded + blurred) state.
    const raf = requestAnimationFrame(() => setVisible(true));
    remainingRef.current = durationMs;
    startTimer();
    return () => {
      cancelAnimationFrame(raf);
      stopTimer();
    };
  }, [message, durationMs, startTimer, stopTimer]);

  // Hide local copy once the owner clears the prop, after a short delay
  // so the CSS opacity/transform transition can play out.
  useEffect(() => {
    if (message === null) {
      setVisible(false);
      const id = setTimeout(
        () => setShown(null),
        prefersReducedMotion() ? 0 : motionDurationMs('--oi-motion-duration-short'),
      );
      return () => clearTimeout(id);
    }
  }, [message]);

  if (!shown) return null;

  const isError = tone === 'error';
  return createPortal(
    <div
      className={cx(styles.toast, styles[`tone_${tone}`])}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      data-visible={visible ? 'true' : 'false'}
      onMouseEnter={() => hold('hover', true)}
      onMouseLeave={() => hold('hover', false)}
      onFocus={() => hold('focus', true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hold('focus', false);
      }}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon name={icon ?? TONE_ICONS[tone]} size="20px" />
      </span>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.title}>{shown}</p>
          {supportingText && <p className={styles.supporting}>{supportingText}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <IconButton icon="X" ariaLabel="Dismiss notification" size="s" onClick={onDismiss} />
    </div>,
    document.body,
  );
}
