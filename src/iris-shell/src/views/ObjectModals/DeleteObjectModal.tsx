import { useEffect, useState } from 'react';
import { ARSDelete } from '@ars';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

/** How long the "Please wait..." step shows, as the delete has no real work to do. */
const DELETE_WAIT_MS = 1200;

type Phase = 'confirm' | 'load' | 'success';

export interface DeleteObjectModalProps {
  open: boolean;
  onClose: () => void;
  /** What kind of object, e.g. User. */
  objectClass: string;
  name: string;
  /** Shown after the name under the title. */
  location: string;
  /** Called when the modal closes after the object was deleted. */
  onDeleted?: () => void;
}

/**
 * DeleteObjectModal — ARS_Delete: type the object's name, wait, then the
 * result. Closing after the result removes the object.
 */
export function DeleteObjectModal({ open, onClose, objectClass, name, location, onDeleted }: DeleteObjectModalProps) {
  const [phase, setPhase] = useState<Phase>('confirm');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (open) {
      setPhase('confirm');
      setTyped('');
    }
  }, [open]);

  useEffect(() => {
    if (phase !== 'load') return undefined;
    const t = setTimeout(() => setPhase('success'), DELETE_WAIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const close = () => {
    // Deleting can't be interrupted.
    if (phase === 'load') return;
    if (phase === 'success') onDeleted?.();
    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={close} label={`Delete ${objectClass}`}>
      <ARSDelete
        variant={phase === 'confirm' ? 'Delete Object' : phase === 'load' ? 'Delete Object_Load' : 'Delete Object_Success'}
        objectClass={objectClass}
        objectName={name}
        location={location}
        value={typed}
        onValueChange={setTyped}
        onClose={close}
        onDelete={() => setPhase('load')}
      />
    </ModalOverlay>
  );
}
