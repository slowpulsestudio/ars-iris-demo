import { Button } from '@iris/components/Button/Button.js';
import { Toast } from '@iris/components/Toast/Toast.js';

export interface ARSNewObjectToastProps {
  /** Toast title; null hides the toast. */
  message: string | null;
  supportingText?: string;
  onView?: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * ARS_New_Object_Toast — the Iris Toast confirming a created object, with
 * View and Dismiss. Figma: 4029:38684.
 */
export function ARSNewObjectToast({ message, supportingText, onView, onDismiss, durationMs }: ARSNewObjectToastProps) {
  return (
    <Toast
      message={message}
      tone="success"
      supportingText={supportingText}
      onDismiss={onDismiss}
      durationMs={durationMs}
      actions={
        <>
          <Button variant="secondary" size="s" onClick={onView}>
            View
          </Button>
          <Button variant="ghost" size="s" onClick={onDismiss}>
            Dismiss
          </Button>
        </>
      }
    />
  );
}
