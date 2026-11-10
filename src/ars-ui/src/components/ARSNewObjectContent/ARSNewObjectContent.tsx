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

const ACCOUNT_OPTIONS = [
  'User must change password at next login',
  'User cannot change password',
  'Password never expires',
  'Account is inactive',
];

export interface ARSNewObjectContentProps {
  /** Figma "Property 1": Default (names and logon) or Variant2 (password and account options). */
  variant?: ARSNewObjectContentVariant;
  /** Figma's hidden "Select destination folder" button; ARS_New_Object_Template shows it. */
  showFolderButton?: boolean;
  /** "container" is the hidden copy inside ARS_New_Object_Content_Container (audit note 1). */
  layout?: 'default' | 'container';
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
  onSelectFolder,
  className,
}: ARSNewObjectContentProps) {
  const [checked, setChecked] = useState<ReadonlySet<string>>(() => new Set([ACCOUNT_OPTIONS[0]]));
  const nameWidth = layout === 'container' ? 280 : undefined;

  return (
    <div className={cx(styles.root, layout === 'container' && styles.container, className)}>
      {variant === 'Default' ? (
        <div className={styles.form}>
          <div className={cx(styles.row, !nameWidth && styles.fillRow)}>
            <FormInput label="First name" required value="Markus" width={nameWidth} />
            <FormInput label="Last name" required value="Kim" width={nameWidth} />
          </div>
          <FormInput label="Initials" value="MK" />
          <FormInput label="Name" required info={INFO} value="MKim" />
          <FormInput label="Display name" required info={INFO} value="Markus Kim" />
          <div className={styles.row}>
            <FormInput label="User logon name" required info={INFO} value="MKim@Entra1" width={280} />
            <FormInput label="Suffix" value="@dom.net" iconTrail="CaretDown" width={280} />
          </div>
          {showFolderButton && (
            <Button variant="secondary" iconLead="FolderOpen" className={styles.folder} onClick={onSelectFolder}>
              Select destination folder
            </Button>
          )}
          <FormInput label="User logon name (pre-Windows 2000)" required info={INFO} value="MKim" />
        </div>
      ) : (
        <div className={styles.form}>
          <FormInput label="Password" required info={INFO} type="password" placeholder="Input text" iconTrail="Eye" />
          <FormInput
            label="Confirm password"
            required
            info={INFO}
            type="password"
            placeholder="Input text"
            iconTrail="Eye"
          />
          <div className={styles.options}>
            <p className={styles.optionsLabel}>Account options:</p>
            <div className={styles.checks}>
              {ACCOUNT_OPTIONS.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={checked.has(option)}
                  onChange={(on) =>
                    setChecked((prev) => {
                      const next = new Set(prev);
                      if (on) next.add(option);
                      else next.delete(option);
                      return next;
                    })
                  }
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
