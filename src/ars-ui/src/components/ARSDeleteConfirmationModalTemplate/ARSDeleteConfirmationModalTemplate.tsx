import { useState } from 'react';
import { Button } from '@iris/components/Button/Button.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Modal } from '@iris/components/Modal/Modal.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import styles from './ARSDeleteConfirmationModalTemplate.module.css';

export interface ARSDeleteConfirmationModalTemplateProps {
  open: boolean;
  /** The object(s) being deleted. */
  objectName?: string;
  onClose: () => void;
  onDelete?: () => void;
}

/**
 * ARS_Delete_Confirmation_Modal_Template — the Iris Modal (S) asking to type
 * REMOVE before deleting. Figma: 2385:59716.
 */
export function ARSDeleteConfirmationModalTemplate({
  open,
  objectName = '[Object name]',
  onClose,
  onDelete,
}: ARSDeleteConfirmationModalTemplateProps) {
  const [text, setText] = useState('');
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="s"
      leadingIcon={<Icon name="Warning" size="24px" className={styles.warning} />}
      title="Delete Object(s)"
      subtitle={`Are you sure you want to delete ${objectName}? This process cannot be undone.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete Object[S]
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <FormField label="Type the word “REMOVE” to confirm" required helperText="More information">
          <TextInput placeholder="Input text" value={text} onChange={(e) => setText(e.target.value)} />
        </FormField>
        {/* Figma's empty 1px "Slot" under the field. */}
        <div className={styles.slot} />
      </div>
    </Modal>
  );
}
