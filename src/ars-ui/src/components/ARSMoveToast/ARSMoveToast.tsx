import { Button } from '@iris/components/Button/Button.js';
import { Toast } from '@iris/components/Toast/Toast.js';

export interface ARSMoveToastProps {
  /** Toast title; null hides the toast. */
  message: string | null;
  onUndo: () => void;
  /** Adds a ghost button next to Undo. */
  onView?: () => void;
  /** Label of that button: "View object" for one object, "View" for several. */
  viewLabel?: string;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * Move toast — the Iris Toast (success) confirming a move, with a secondary
 * Undo and an optional ghost View. Figma: 2355:28099 (several objects),
 * 2396:13581 (one object, View object), 2381:23259 (one object, Undo only).
 */
export function ARSMoveToast({ message, onUndo, onView, viewLabel = 'View', onDismiss, durationMs }: ARSMoveToastProps) {
  return (
    <Toast
      message={message}
      tone="success"
      onDismiss={onDismiss}
      durationMs={durationMs}
      actions={
        <>
          <Button variant="secondary" size="s" onClick={onUndo}>
            Undo
          </Button>
          {onView && (
            <Button variant="ghost" size="s" onClick={onView}>
              {viewLabel}
            </Button>
          )}
        </>
      }
    />
  );
}
