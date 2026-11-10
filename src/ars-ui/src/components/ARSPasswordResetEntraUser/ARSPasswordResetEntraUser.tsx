import { Button } from '@iris/components/Button/Button.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import { ARSResetContentSuccess } from '../ARSResetContentSuccess/ARSResetContentSuccess.js';

export interface ARSPasswordResetEntraUserProps {
  userName?: string;
  location?: string;
  onClose?: () => void;
  className?: string;
}

/**
 * ARS_Password_Reset_Entra_User — the Entra password reset result: the new
 * temporary password and Close. Figma: 4486:19008.
 */
export function ARSPasswordResetEntraUser({
  userName = '[Username]',
  location = '[Location]',
  onClose,
  className,
}: ARSPasswordResetEntraUserProps) {
  return (
    <ModalPanel
      icon="Password"
      title="Password Reset"
      supportingText={`${userName} · ${location}`}
      onClose={onClose}
      className={className}
      actions={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <ARSResetContentSuccess />
    </ModalPanel>
  );
}
