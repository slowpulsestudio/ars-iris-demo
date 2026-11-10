import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';
import { JOB_INFO_FIELDS } from '../ARSUsersJobInfoCard/ARSUsersJobInfoCard.js';
import type { ARSUserCardVariant } from '../ARSUsersPropertiesCard/ARSUsersPropertiesCard.js';

const ROWS: DetailsRow[] = [
  { label: 'Street address', value: '1 Street Lane' },
  { label: 'City', value: 'London' },
  { label: 'State', value: 'Greater London' },
  { label: 'ZIP/Postal code', value: 'GL1 1NL' },
  { label: 'Country/Reigon', value: 'United Kingdom' },
  { label: 'Business phone', value: '01268 888000' },
  { label: 'Mobile phone', value: '+44 077788880' },
  { label: 'Email', value: 'MKim@Acme.com' },
  { label: 'other emails' },
  { label: 'Fax phone' },
  { label: 'Mail Nickname' },
];

// Figma's edit variant of this card shows the job fields, with Budapest as the office.
const FIELDS = JOB_INFO_FIELDS.map((f) => (f.label === 'Office location' ? { ...f, value: 'Budapest' } : f));

export interface ARSUsersContactInfoCardProps {
  /** Figma "Default" is read mode; "Variant2" is edit mode. */
  variant?: ARSUserCardVariant;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/** ARS_Users_ContactInfo Card — a user's contact details, read or edited. Figma: 2820:30082. */
export function ARSUsersContactInfoCard({ variant = 'Default', ...props }: ARSUsersContactInfoCardProps) {
  return (
    <DetailsCard
      {...props}
      title="Contact information"
      helper="Manage contact information."
      editing={variant === 'Variant2'}
      rows={ROWS}
      fields={FIELDS}
    />
  );
}
