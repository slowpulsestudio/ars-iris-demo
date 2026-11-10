import { useState } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { Spinner } from '@iris/components/Spinner/Spinner.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import { PasswordInput } from '../../parts/PasswordInput/PasswordInput.js';
import { ARSResetContentSuccess } from '../ARSResetContentSuccess/ARSResetContentSuccess.js';
import styles from './ARSUserPasswordResetAD.module.css';

export type ARSUserPasswordResetADVariant = 'Empty' | 'Filled' | 'wait' | 'Success';

export const ARS_PASSWORD_RESET_OPTIONS = [
  'User must change password at next logon',
  'User cannot change password',
  'Password never expires',
  'Account is disabled',
];

const SAMPLE_PASSWORD = 'Passw0rd!234';

export interface ARSPasswordResetValues {
  password: string;
  confirmPassword: string;
}

export interface ARSUserPasswordResetADProps {
  /** Figma "Property 1": Empty, Filled, wait (resetting) or Success. */
  variant?: ARSUserPasswordResetADVariant;
  userName?: string;
  location?: string;
  /** Makes the fields controlled; without it Filled shows Figma's sample. */
  values?: ARSPasswordResetValues;
  onValuesChange?: (next: ARSPasswordResetValues) => void;
  /** The ticked account options (controlled). */
  accountOptions?: ReadonlySet<string>;
  onAccountOptionsChange?: (next: Set<string>) => void;
  /** Success: the password to hand over. */
  resultPassword?: string;
  onClose?: () => void;
  onReset?: () => void;
  className?: string;
}

/**
 * ARS_User_Password_Reset_AD — reset an AD user's password: new password,
 * confirmation and account options, then progress and the result.
 * Figma: 4486:18890.
 */
export function ARSUserPasswordResetAD({
  variant = 'Empty',
  userName = '[Username]',
  location = '[Location]',
  values,
  onValuesChange,
  accountOptions,
  onAccountOptionsChange,
  resultPassword,
  onClose,
  onReset,
  className,
}: ARSUserPasswordResetADProps) {
  const [localOptions, setLocalOptions] = useState<ReadonlySet<string>>(() => new Set([ARS_PASSWORD_RESET_OPTIONS[0]]));
  const checked = accountOptions ?? localOptions;
  const filled = variant === 'Filled';
  const finished = variant === 'wait' || variant === 'Success';

  const field = (key: keyof ARSPasswordResetValues) =>
    values
      ? { value: values[key], onChange: (e: { target: { value: string } }) => onValuesChange?.({ ...values, [key]: e.target.value }) }
      : { defaultValue: filled ? SAMPLE_PASSWORD : undefined };

  return (
    <ModalPanel
      icon="Password"
      title="Password Reset"
      supportingText={`${userName}  · ${location}`}
      onClose={onClose}
      className={cx(styles.root, className)}
      bodyClassName={variant === 'wait' ? styles.waitBody : undefined}
      actions={
        finished ? (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!filled} onClick={onReset}>
              Reset password
            </Button>
          </>
        )
      }
    >
      {variant === 'wait' ? (
        <>
          <p className={styles.wait}>Please wait...</p>
          <div className={styles.spinner}>
            <Spinner size="l" label="Resetting password" />
          </div>
        </>
      ) : variant === 'Success' ? (
        <ARSResetContentSuccess password={resultPassword} />
      ) : (
        <>
          <FormField label="Password" required help="Use 8-16 characters with a mix of numbers and symbols.">
            <PasswordInput key={values ? 'controlled' : variant} copyable placeholder="Enter new passowrd" {...field('password')} />
          </FormField>
          <FormField label="Confirm password" required>
            <PasswordInput key={values ? 'controlled' : variant} {...field('confirmPassword')} />
          </FormField>
          <div className={styles.options}>
            <p className={styles.optionsLabel}>Account options</p>
            {ARS_PASSWORD_RESET_OPTIONS.map((option) => (
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
        </>
      )}
    </ModalPanel>
  );
}
