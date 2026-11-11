import type { Ref } from 'react';
import { Avatar } from '../../components/Avatar/Avatar.js';
import { Badge, type BadgeTone } from '../../components/Badge/Badge.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Menu, type MenuEntry } from '../../components/Menu/Menu.js';
import { Select } from '../../components/Select/Select.js';
import type { Person } from './userViewData.js';
import styles from './UserView.module.css';

const TONES: Record<string, BadgeTone> = {
  Active: 'success',
  Approved: 'success',
  Pending: 'warning',
  Inactive: 'neutral',
  Revoked: 'error',
  Denied: 'error',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={TONES[status] ?? 'neutral'}>{status}</Badge>;
}

/** Person card (Figma 10301:2300): avatar, name, email and the person's role in the request. */
export function PersonCard({ person, role }: { person: Person; role: 'Owner' | 'Requester' }) {
  return (
    <div className={styles.person}>
      <Avatar name={person.name} size="m" />
      <div className={styles.personText}>
        <span className={styles.personName}>{person.name}</span>
        <span className={styles.personEmail}>{person.email}</span>
      </div>
      <Badge tone="neutral">{role}</Badge>
    </div>
  );
}

/** A label above a dropdown of options (Iris FormField, Menu and Select). */
export function SelectField({
  label,
  value,
  options,
  onChange,
  required,
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <FormField label={label} required={required} helperText={helper}>
      <Menu
        ariaLabel={label}
        align="start"
        items={options.map<MenuEntry>((option) => ({
          kind: 'item',
          label: option,
          selected: option === value,
          onSelect: () => onChange(option),
        }))}
        trigger={({ ref, onClick, expanded }) => (
          <Select
            ref={ref as Ref<HTMLButtonElement>}
            label={value}
            placeholder={placeholder}
            onClick={onClick}
            aria-haspopup="listbox"
            aria-expanded={expanded}
          />
        )}
      />
    </FormField>
  );
}

/** A label and its value, as the request details draw them. */
export function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{children}</span>
    </div>
  );
}
