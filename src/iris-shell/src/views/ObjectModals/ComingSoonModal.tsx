import { Button } from '../../components/Button/Button.js';
import { Modal } from '../../components/Modal/Modal.js';
import { ComingSoon } from '../ComingSoon/ComingSoon.js';

export interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  /** The action it stands in for, e.g. Deprovision. */
  title: string;
  /** Who the action is for, shown under the title. */
  subtitle?: string;
}

/** ComingSoonModal — confirmation for an action that isn't built yet; it has no content and does nothing. */
export function ComingSoonModal({ open, onClose, title, subtitle }: ComingSoonModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Confirm</Button>
        </>
      }
    >
      <ComingSoon label={title} />
    </Modal>
  );
}
