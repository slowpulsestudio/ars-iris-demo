import { ModalMessage } from '../../parts/ModalMessage/ModalMessage.js';

export interface ARSModalContentDeleteProps {
  /** The object being deleted, e.g. user ‘MKim’. */
  objectLabel?: string;
  className?: string;
}

/**
 * ARS_Modal_Content_Delete — delete confirmation content: warning, the
 * question, a field to type DELETE into and its instruction. Figma: 3651:44611.
 */
export function ARSModalContentDelete({ objectLabel = 'user ‘MKim’', className }: ARSModalContentDeleteProps) {
  return (
    <ModalMessage
      tone="error"
      icon="Warning"
      title={`Are you sure you wish to delete ${objectLabel}? This process is not reversable.`}
      value="DELETE"
      inputLabel="Type DELETE to confirm"
      message="Please type ‘DELETE’ in the box and then confirm to proceed with this action."
      className={className}
    />
  );
}
