import type { FormInputProps } from '../../parts/FormInput/FormInput.js';
import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';

export type ARSUserCardVariant = 'Default' | 'Variant2';

const DESCRIPTION = 'Duis aute irure dolor in reprehenderit in voluptate velit esse eu fugiat nulla pariatur.';

const ROWS: DetailsRow[] = [
  { label: 'First name', value: 'Markus' },
  { label: 'Last name', value: 'Kim' },
  { label: 'Initials', value: 'MK' },
  { label: 'Display name', value: 'MKim' },
  { label: 'User principle name', value: 'MKim@Entra1' },
  { label: 'Description', value: DESCRIPTION },
];

const FIELDS: (FormInputProps | FormInputProps[])[] = [
  { label: 'First name', value: 'Markus', required: true, width: 280 },
  { label: 'Last name', value: 'Kim', required: true, width: 280 },
  { label: 'Initials', value: 'MK', width: 70 },
  { label: 'Display name', value: 'MKim', required: true, width: 280 },
  [
    { label: 'User principal name', value: 'Markus', required: true, width: 280 },
    { label: 'Directory', value: '@Entra1', required: true, width: 140, iconTrail: 'CaretDown' },
  ],
  { label: 'Description', value: DESCRIPTION, multiline: true },
];

export interface ARSUsersPropertiesCardProps {
  /** Figma "Default" is read mode; "Variant2" is edit mode. */
  variant?: ARSUserCardVariant;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/** ARS_users_Properties Card — a user's names, read or edited. Figma: 2820:29757. */
export function ARSUsersPropertiesCard({ variant = 'Default', ...props }: ARSUsersPropertiesCardProps) {
  return (
    <DetailsCard
      {...props}
      title="Properties"
      helper="Manage identity and display names."
      editing={variant === 'Variant2'}
      rows={ROWS}
      fields={FIELDS}
    />
  );
}
