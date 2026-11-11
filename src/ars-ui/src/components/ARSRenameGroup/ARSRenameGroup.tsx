import { Button } from '@iris/components/Button/Button.js';
import { FormInput } from '../../parts/FormInput/FormInput.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import styles from './ARSRenameGroup.module.css';

export interface ARSRenameGroupProps {
  name: string;
  onNameChange?: (value: string) => void;
  /** The pre-Windows 2000 group name. */
  groupName: string;
  onGroupNameChange?: (value: string) => void;
  /** Field errors, e.g. "Name is required." */
  nameError?: string;
  groupNameError?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onRename?: () => void;
  className?: string;
}

/**
 * Rename Group modal: the group's Name and its pre-Windows 2000 name. Missing
 * from Figma as a frame: the ARS_WebUI2_Groups file only has the written
 * requirement (64:6802). Built on the ARS 620px modal panel.
 */
export function ARSRenameGroup({
  name,
  onNameChange,
  groupName,
  onGroupNameChange,
  nameError,
  groupNameError,
  onClose,
  onCancel,
  onRename,
  className,
}: ARSRenameGroupProps) {
  return (
    <ModalPanel
      icon="PencilSimple"
      title="Rename Group"
      onClose={onClose}
      className={className}
      bodyClassName={styles.body}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onRename}>Rename</Button>
        </>
      }
    >
      <FormInput label="Name" required value={name} onChange={onNameChange} error={nameError} />
      <FormInput
        label="Group name (Pre-Windows 2000)"
        required
        value={groupName}
        onChange={onGroupNameChange}
        error={groupNameError}
      />
    </ModalPanel>
  );
}
