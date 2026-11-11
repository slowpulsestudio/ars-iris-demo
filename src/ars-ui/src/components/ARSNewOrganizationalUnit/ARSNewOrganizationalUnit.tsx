import { cx } from '@iris/lib/cx.js';
import { ARSNewObjectTemplate } from '../ARSNewObjectTemplate/ARSNewObjectTemplate.js';
import { FormInput } from '../../parts/FormInput/FormInput.js';
import styles from './ARSNewOrganizationalUnit.module.css';

export interface ARSNewOrganizationalUnitValues {
  name: string;
  description: string;
  protect: boolean;
  openProperties: boolean;
}

export interface ARSNewOrganizationalUnitProps {
  values: ARSNewOrganizationalUnitValues;
  onValuesChange?: (patch: Partial<ARSNewOrganizationalUnitValues>) => void;
  nameError?: string;
  /** Where the OU is created, e.g. "O1D.local/AD 1". */
  location?: string;
  onClose?: () => void;
  onCreate?: () => void;
  className?: string;
}

/**
 * ARS_New_Organizational_Unit — the New Organizational Unit modal: Name,
 * Description, the protect checkbox and an explanation on the right.
 * Figma: 1394:14812 (ARS_WebUI2_OU_Management), not in ARS - Primary. The
 * "Open properties" checkbox is from the written requirement (1091:6250).
 */
export function ARSNewOrganizationalUnit({
  values,
  onValuesChange,
  nameError,
  location = 'O1D.local/AD 1',
  onClose,
  onCreate,
  className,
}: ARSNewOrganizationalUnitProps) {
  return (
    <ARSNewObjectTemplate
      className={cx(styles.root, className)}
      title="New Organizational Unit"
      location={location}
      icon="User"
      hasSteps={false}
      footerVariant="2"
      ctaLabel="Save & Continue →"
      onClose={onClose}
      onBack={onClose}
      onContinue={onCreate}
    >
      <div className={styles.layout}>
        <div className={styles.form}>
          <FormInput
            label="Name"
            required
            value={values.name}
            onChange={(name) => onValuesChange?.({ name })}
            error={nameError}
          />
          <FormInput
            label="Description"
            multiline
            value={values.description}
            onChange={(description) => onValuesChange?.({ description })}
          />
          <FormInput
            label="Protect container from accidental deletion"
            checkbox
            value={String(values.protect)}
            onChange={(on) => onValuesChange?.({ protect: on === 'true' })}
          />
          <FormInput
            label="Open properties for this object when I click finish"
            checkbox
            value={String(values.openProperties)}
            onChange={(on) => onValuesChange?.({ openProperties: on === 'true' })}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>Add new organizational unit</h3>
          <p className={styles.text}>
            Create an organizational unit (OU) for structuring your team or department hierarchy. Use OUs to group
            members, apply policies and manage access across your organization.
          </p>
        </div>
      </div>
    </ARSNewObjectTemplate>
  );
}
