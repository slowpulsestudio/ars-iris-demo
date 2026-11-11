import type { FormInputProps } from '../../parts/FormInput/FormInput.js';
import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';
import type { ARSUserCardVariant } from '../ARSUsersPropertiesCard/ARSUsersPropertiesCard.js';

export const JOB_INFO_ROWS: DetailsRow[] = [
  { label: 'Job title', value: 'Manager' },
  { label: 'Company name', value: 'Acme' },
  { label: 'Department', value: 'Security' },
  { label: 'Employee ID', value: 'MKim9876' },
  { label: 'Employee type', value: 'Staff' },
  { label: 'Employee hire Date', value: '01/01/2000' },
  { label: 'Office Location', value: 'London' },
  { label: 'Manager', value: 'Will E' },
  { label: 'Sponsors' },
];

export const JOB_INFO_FIELDS: FormInputProps[] = [
  { label: 'Job title', value: 'Manager', width: 280 },
  { label: 'Company name', value: 'Acme', width: 280 },
  { label: 'Department', value: 'Security', width: 280 },
  { label: 'Employee ID', value: 'MKim9876', width: 280 },
  { label: 'Employee type', value: 'Staff', width: 280 },
  { label: 'Employee hire date', value: '01/01/2000', width: 280, iconTrail: 'Calendar' },
  { label: 'Office location', value: 'London', width: 280 },
  { label: 'Manager', value: 'Will E', width: 280 },
  { label: 'Sponsors', width: 280 },
];

export interface ARSUsersJobInfoCardProps {
  /** Figma "Default" is read mode; "Variant2" is edit mode. */
  variant?: ARSUserCardVariant;
  /** Replaces the sample rows and form fields, and `editing` replaces the variant. */
  rows?: DetailsRow[];
  fields?: FormInputProps[];
  editing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/** ARS_Users_Job Info Card — a user's job details, read or edited. Figma: 2820:29901. */
export function ARSUsersJobInfoCard({ variant = 'Default', rows, fields, editing, ...props }: ARSUsersJobInfoCardProps) {
  return (
    <DetailsCard
      {...props}
      title="Job information"
      helper="Manage job information."
      editing={editing ?? variant === 'Variant2'}
      rows={rows ?? JOB_INFO_ROWS}
      fields={fields ?? JOB_INFO_FIELDS}
    />
  );
}
