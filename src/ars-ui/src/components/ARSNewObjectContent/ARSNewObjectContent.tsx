import { useState } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { FormInput } from '../../parts/FormInput/FormInput.js';
import styles from './ARSNewObjectContent.module.css';

export type ARSNewObjectContentVariant = 'Default' | 'Variant2';

const INFO = 'More information';

const DESCRIPTION: Record<ARSNewObjectContentVariant, string> = {
  Default:
    'Manage identity and display names. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis  suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
  Variant2:
    'Mange account details. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis  suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
};

export const ARS_ACCOUNT_OPTIONS = [
  'User must change password at next login',
  'User cannot change password',
  'Password never expires',
  'Account is inactive',
];

export const ARS_SUFFIX_OPTIONS = ['@dom.net'];

/** The form's text values; Figma's sample for each is the field's placeholder when controlled. */
export interface ARSNewObjectValues {
  firstName: string;
  lastName: string;
  initials: string;
  name: string;
  displayName: string;
  userLogonName: string;
  suffix: string;
  preWindows2000: string;
  password: string;
  confirmPassword: string;
}

export const ARS_EMPTY_NEW_OBJECT_VALUES: ARSNewObjectValues = {
  firstName: '',
  lastName: '',
  initials: '',
  name: '',
  displayName: '',
  userLogonName: '',
  suffix: '',
  preWindows2000: '',
  password: '',
  confirmPassword: '',
};

export interface ARSNewObjectContentProps {
  /** Figma "Property 1": Default (names and logon) or Variant2 (password and account options). */
  variant?: ARSNewObjectContentVariant;
  /** Figma's hidden "Select destination folder" button; ARS_New_Object_Template shows it. */
  showFolderButton?: boolean;
  /** "container" is the hidden copy inside ARS_New_Object_Content_Container (audit note 1). */
  layout?: 'default' | 'container';
  /** Makes the form controlled; without it the fields show Figma's sample values. */
  values?: ARSNewObjectValues;
  onValuesChange?: (patch: Partial<ARSNewObjectValues>) => void;
  /** Variant2: the ticked account options (controlled). */
  accountOptions?: ReadonlySet<string>;
  onAccountOptionsChange?: (next: Set<string>) => void;
  onSelectFolder?: () => void;
  className?: string;
}

/**
 * ARS_New_Object_Content — the new-object form beside its heading.
 * Figma: 3493:17061.
 */
export function ARSNewObjectContent({
  variant = 'Default',
  showFolderButton = false,
  layout = 'default',
  values,
  onValuesChange,
  accountOptions,
  onAccountOptionsChange,
  onSelectFolder,
  className,
}: ARSNewObjectContentProps) {
  const [localOptions, setLocalOptions] = useState<ReadonlySet<string>>(() => new Set([ARS_ACCOUNT_OPTIONS[0]]));
  const checked = accountOptions ?? localOptions;
  const nameWidth = layout === 'container' ? 280 : undefined;

  /** Figma's sample is the value when uncontrolled and the placeholder when controlled. */
  const field = (key: keyof ARSNewObjectValues, sample: string) =>
    values
      ? { value: values[key], placeholder: sample, onChange: (v: string) => onValuesChange?.({ [key]: v }) }
      : { value: sample };

  return (
    <div className={cx(styles.root, layout === 'container' && styles.container, className)}>
      {variant === 'Default' ? (
        <div className={styles.form}>
          <div className={cx(styles.row, !nameWidth && styles.fillRow)}>
            <FormInput label="First name" required {...field('firstName', 'Markus')} width={nameWidth} />
            <FormInput label="Last name" required {...field('lastName', 'Kim')} width={nameWidth} />
          </div>
          <FormInput label="Initials" {...field('initials', 'MK')} />
          <FormInput label="Name" required info={INFO} {...field('name', 'MKim')} />
          <FormInput label="Display name" required info={INFO} {...field('displayName', 'Markus Kim')} />
          <div className={styles.row}>
            <FormInput label="User logon name" required info={INFO} {...field('userLogonName', 'MKim@Entra1')} width={280} />
            <FormInput
              label="Suffix"
              {...field('suffix', '@dom.net')}
              select={values ? true : undefined}
              options={values ? ARS_SUFFIX_OPTIONS : undefined}
              iconTrail="CaretDown"
              width={280}
            />
          </div>
          {showFolderButton && (
            <Button variant="secondary" iconLead="FolderOpen" className={styles.folder} onClick={onSelectFolder}>
              Select destination folder
            </Button>
          )}
          <FormInput
            label="User logon name (pre-Windows 2000)"
            required
            info={INFO}
            {...field('preWindows2000', 'MKim')}
          />
        </div>
      ) : (
        <div className={styles.form}>
          <FormInput
            label="Password"
            required
            info={INFO}
            type="password"
            iconTrail="Eye"
            {...(values ? field('password', 'Input text') : { placeholder: 'Input text' })}
          />
          <FormInput
            label="Confirm password"
            required
            info={INFO}
            type="password"
            iconTrail="Eye"
            {...(values ? field('confirmPassword', 'Input text') : { placeholder: 'Input text' })}
          />
          <div className={styles.options}>
            <p className={styles.optionsLabel}>Account options:</p>
            <div className={styles.checks}>
              {ARS_ACCOUNT_OPTIONS.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={checked.has(option)}
                  onChange={(on) => {
                    const next = new Set(checked);
                    if (on) next.add(option);
                    else next.delete(option);
                    setLocalOptions(next);
                    onAccountOptionsChange?.(next);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.heading}>
          <h3 className={styles.title}>Add new object</h3>
          <p className={styles.description}>{DESCRIPTION[variant]}</p>
        </div>
      </div>
    </div>
  );
}
