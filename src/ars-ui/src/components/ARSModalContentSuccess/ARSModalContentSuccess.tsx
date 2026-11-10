import { ModalMessage } from '../../parts/ModalMessage/ModalMessage.js';

export interface ARSModalContentSuccessProps {
  /** The temporary password to hand to the user. */
  password?: string;
  className?: string;
}

/**
 * ARS_Modal_Content_Success — password reset confirmation content: success
 * icon, the message, the temporary password and its instruction. Figma: 3651:44368.
 */
export function ARSModalContentSuccess({ password = 'Temp1234', className }: ARSModalContentSuccessProps) {
  return (
    <ModalMessage
      tone="success"
      icon="CheckCircle"
      title="Password has been reset successfully."
      value={password}
      type="password"
      inputLabel="Temporary password"
      message="Provide this temporary password to the user so they can sign in."
      className={className}
    />
  );
}
