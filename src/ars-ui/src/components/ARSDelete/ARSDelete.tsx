import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Spinner } from '@iris/components/Spinner/Spinner.js';
import { ModalMessage } from '../../parts/ModalMessage/ModalMessage.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import styles from './ARSDelete.module.css';

export type ARSDeleteVariant = 'Delete Object' | 'Delete Object_Load' | 'Delete Object_Success';

export interface ARSDeleteProps {
  /** Figma "Property 1": confirm, deleting, or deleted. */
  variant?: ARSDeleteVariant;
  /** What kind of object, e.g. User. */
  objectClass?: string;
  objectName?: string;
  /** Shown after the name under the title, e.g. the directory. */
  location?: string;
  /** The typed confirmation (controlled); without it the field shows Figma's sample. */
  value?: string;
  onValueChange?: (value: string) => void;
  onClose?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * ARS_Delete — the delete modal: confirm by typing the object's name, then
 * progress and the result. Figma: ARS_WebUI2_CRUD, 1755:15058 (not in
 * ARS - Primary); content from ARS_CRUD_Delete (3267:16017) and
 * ARS_CRUD_Delete_Success (3267:16120).
 */
export function ARSDelete({
  variant = 'Delete Object',
  objectClass = 'User',
  objectName = 'MKim',
  location = 'Entra1',
  value,
  onValueChange,
  onClose,
  onDelete,
  className,
}: ARSDeleteProps) {
  const noun = objectClass.toLowerCase();
  const confirming = variant === 'Delete Object';
  const matches = (value ?? objectName) === objectName;

  return (
    <ModalPanel
      icon="Trash"
      title={`Delete ${objectClass}`}
      supportingText={`${objectName} · ${location}`}
      onClose={onClose}
      className={cx(styles.root, className)}
      bodyClassName={variant === 'Delete Object_Load' ? styles.loadBody : undefined}
      footerClassName={styles.footer}
      actions={
        confirming ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!matches} onClick={onDelete}>
              {`Delete ${noun}`}
            </Button>
          </>
        ) : variant === 'Delete Object_Success' ? (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        ) : null
      }
    >
      {confirming ? (
        <ModalMessage
          tone="error"
          icon="Warning"
          title={`Are you sure that you want to delete ${noun} '${objectName}'? This action cannot be undone.`}
          value={value ?? objectName}
          onChange={onValueChange}
          inputLabel={`Type ${objectName} to confirm`}
          message={`To confirm, enter '${objectName}'.`}
          className={styles.message}
        />
      ) : variant === 'Delete Object_Load' ? (
        <>
          <p className={styles.wait}>Please wait...</p>
          <div className={styles.spinner}>
            <Spinner size="l" label="Deleting" />
          </div>
        </>
      ) : (
        <div className={styles.notice}>
          <span className={styles.success} aria-hidden="true">
            <Icon name="CheckCircle" size="24px" />
          </span>
          <div className={styles.text}>
            <p className={styles.title}>{`Object '${objectName}' has been deleted successfully.`}</p>
            <p className={styles.description}>You can now close this Pop-Up.</p>
          </div>
        </div>
      )}
    </ModalPanel>
  );
}
