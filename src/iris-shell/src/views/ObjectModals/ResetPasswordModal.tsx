import { useEffect, useState } from 'react';
import {
  ARSPasswordResetEntraUser,
  ARSUserPasswordResetAD,
  type ARSPasswordResetValues,
} from '@ars';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

/** How long the "Please wait..." step shows, as the reset has no real work to do. */
const RESET_WAIT_MS = 1500;

type Phase = 'form' | 'wait' | 'success';

const EMPTY: ARSPasswordResetValues = { password: '', confirmPassword: '' };
const DEFAULT_OPTIONS = ['User must change password at next logon'];

function temporaryPassword(): string {
  return `Tmp-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  /** Only the name is shown. */
  user: { name: string };
  /** Shown after the name under the title, e.g. the directory. */
  location: string;
  /** Entra users get a generated temporary password; AD users choose one. */
  entra?: boolean;
}

/**
 * ResetPasswordModal — ARS_User_Password_Reset_AD (choose a password, wait,
 * result) or ARS_Password_Reset_Entra_User (the generated temporary password).
 */
export function ResetPasswordModal({ open, onClose, user, location, entra = false }: ResetPasswordModalProps) {
  const [phase, setPhase] = useState<Phase>('form');
  const [values, setValues] = useState<ARSPasswordResetValues>(EMPTY);
  const [options, setOptions] = useState<ReadonlySet<string>>(() => new Set(DEFAULT_OPTIONS));
  const [generated, setGenerated] = useState(temporaryPassword);

  useEffect(() => {
    if (open) {
      setPhase('form');
      setValues(EMPTY);
      setOptions(new Set(DEFAULT_OPTIONS));
      setGenerated(temporaryPassword());
    }
  }, [open]);

  useEffect(() => {
    if (phase !== 'wait') return undefined;
    const t = setTimeout(() => setPhase('success'), RESET_WAIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const filled = values.password !== '' && values.password === values.confirmPassword;

  return (
    <ModalOverlay open={open} onClose={onClose} label="Password Reset">
      {entra ? (
        <ARSPasswordResetEntraUser userName={user.name} location={location} password={generated} onClose={onClose} />
      ) : (
        <ARSUserPasswordResetAD
          variant={phase === 'form' ? (filled ? 'Filled' : 'Empty') : phase === 'wait' ? 'wait' : 'Success'}
          userName={user.name}
          location={location}
          values={values}
          onValuesChange={setValues}
          accountOptions={options}
          onAccountOptionsChange={setOptions}
          resultPassword={values.password}
          onClose={onClose}
          onReset={() => setPhase('wait')}
        />
      )}
    </ModalOverlay>
  );
}
