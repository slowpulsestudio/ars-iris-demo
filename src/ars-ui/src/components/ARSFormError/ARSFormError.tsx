import { cx } from '@iris/lib/cx.js';
import { Banner } from '@iris/components/Banner/Banner.js';
import { Button } from '@iris/components/Button/Button.js';
import { Card } from '../../parts/Card/Card.js';
import { FormInput } from '../../parts/FormInput/FormInput.js';
import styles from './ARSFormError.module.css';

const INFO = 'More information';

export interface ARSFormErrorProps {
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/**
 * ARS_Form_Error — the new-object properties form after a failed save: an
 * error Banner above the card and the field's error message. Figma: 3621:46744.
 */
export function ARSFormError({ onCancel, onSave, className }: ARSFormErrorProps) {
  return (
    <div className={cx(styles.root, className)}>
      <Banner tone="error" colored icon="Warning" title="Unable to save and continue">
        Locate fields with errors and resolve.
      </Banner>
      <Card
        title="Properties"
        helper="Manage identity and display names."
        className={styles.card}
        actions={
          <div className={styles.actions}>
            <Button variant="secondary" size="s" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="s" onClick={onSave}>
              Save
            </Button>
          </div>
        }
      >
        <div className={styles.row}>
          <FormInput label="First name" required value="Markus" width={280} />
          <FormInput label="Last name" required value="Kim" width={280} />
        </div>
        <FormInput label="Initials" value="MK" width={140} />
        <FormInput label="Name" required info={INFO} value="MKim" width={280} />
        <FormInput label="Display name" required info={INFO} value="MKim" width={280} />
        <div className={styles.row}>
          <FormInput
            label="User logon name"
            required
            info={INFO}
            placeholder="MKim@Entra1"
            error="User logon name already exists."
            width={280}
          />
          <FormInput label="Suffix" value="@dom.net" iconTrail="CaretDown" width={140} />
        </div>
        <FormInput label="*User logon name (pre-Windows 2000)" required info={INFO} value="MKim" width={280} />
      </Card>
    </div>
  );
}
