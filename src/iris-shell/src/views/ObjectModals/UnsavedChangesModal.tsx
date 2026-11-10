import { ARSModalFormUnsaved } from '@ars';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

export interface UnsavedChangesModalProps {
  open: boolean;
  /** Cancel, the close button, Escape and the scrim: stay and review the changes. */
  onCancel: () => void;
  /** Discard the changes and carry on. */
  onConfirm: () => void;
}

/** UnsavedChangesModal — ARS_Modal_Form_Unsaved, shown before leaving a form with changes. */
export function UnsavedChangesModal({ open, onCancel, onConfirm }: UnsavedChangesModalProps) {
  return (
    <ModalOverlay open={open} onClose={onCancel} label="Unsaved changes">
      <ARSModalFormUnsaved onClose={onCancel} onCancel={onCancel} onConfirm={onConfirm} />
    </ModalOverlay>
  );
}
