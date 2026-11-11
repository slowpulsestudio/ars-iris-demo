import type { ReactNode, Ref } from 'react';
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

/** The self-service screens' heading: title, subtitle and actions, with no icon tile. */
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

const DOT: Record<string, string> = {
  Active: styles.dotSuccess,
  Pending: styles.dotWarning,
  Inactive: styles.dotNeutral,
  Revoked: styles.dotError,
};

/** A count card with a status dot (Access Summary and My Access stats). */
export function StatusCount({ status, label, value, text }: { status: string; label: string; value: number; text?: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        {DOT[status] && <span className={`${styles.dot} ${DOT[status]}`} aria-hidden="true" />}
      </div>
      <span className={styles.statValue}>{value}</span>
      {text && <span className={styles.statText}>{text}</span>}
    </div>
  );
}

/** Person card (Figma 10301:2300): avatar, name, email and the person's role in the request. */
export function PersonCard({ person, role }: { person: Person; role: 'Owner' | 'Requester' }) {
  return (
    <div className={styles.person}>
      <Avatar name={person.name} size="default" />
      <div className={styles.personText}>
        <span className={styles.personName}>{person.name}</span>
        <span className={styles.personEmail}>{person.email}</span>
      </div>
      <Badge tone="neutral">{role}</Badge>
    </div>
  );
}

/** A label and its value side by side, as the request details draw them. */
export function Detail({ label, children, tone }: { label: string; children: ReactNode; tone?: 'error' }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={tone === 'error' ? `${styles.detailValue} ${styles.errorText}` : styles.detailValue}>{children}</span>
    </div>
  );
}

/** A dropdown of options under a label (Iris FormField, Menu and Select). */
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
    <FormField label={label} required={required} help={helper}>
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
            aria-label={label}
            aria-haspopup="listbox"
            aria-expanded={expanded}
          />
        )}
      />
    </FormField>
  );
}
