import { Activity, useEffect, useState, type ReactNode } from 'react';
import { ARSModalFormUnsaved } from '@ars';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

export interface NewObjectOverlayProps {
  open: boolean;
  /** The form's accessible name, e.g. "New AD User". */
  label: string;
  /** A text field has a value, so closing asks first. */
  filledIn: boolean;
  onClose: () => void;
  /** Something over the form (the Select folder sheet) handles Escape and outside clicks itself. */
  covered?: boolean;
  /** The form, given the close that asks first, for its close and Discard buttons. */
  children: (requestClose: () => void) => ReactNode;
}

/**
 * NewObjectOverlay — the modal of every New object form, New User and New Group (decided UI rule MOD-2). Closing a
 * filled-in form (its close or Discard button, Escape, a click outside) swaps it for the Unsaved changes question in
 * the same modal, which resizes to it: one floating layer at a time. The form stays mounted underneath, so Keep my
 * progress brings it back as it was. An empty form closes straight away.
 */
export function NewObjectOverlay({ open, label, filledIn, onClose, covered = false, children }: NewObjectOverlayProps) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open) setConfirming(false);
  }, [open]);

  const requestClose = () => {
    if (filledIn) setConfirming(true);
    else onClose();
  };

  return (
    <ModalOverlay
      open={open}
      label={confirming ? 'Unsaved changes' : label}
      panelKey={confirming ? 'unsaved' : 'form'}
      onClose={() => {
        if (covered) return;
        if (confirming) setConfirming(false);
        else requestClose();
      }}
    >
      <Activity mode={confirming ? 'hidden' : 'visible'}>{children(requestClose)}</Activity>
      {confirming && (
        <ARSModalFormUnsaved
          destructive
          onClose={() => setConfirming(false)}
          onCancel={() => setConfirming(false)}
          onConfirm={() => onClose()}
        />
      )}
    </ModalOverlay>
  );
}
