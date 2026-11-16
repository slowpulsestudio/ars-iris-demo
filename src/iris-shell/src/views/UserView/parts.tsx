import type { ReactNode, Ref } from 'react';
import { cx } from '../../lib/cx.js';
import { Avatar } from '../../components/Avatar/Avatar.js';
import { Badge, type BadgeTone } from '../../components/Badge/Badge.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Icon } from '../../components/Icon/Icon.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Menu, type MenuEntry } from '../../components/Menu/Menu.js';
import { Select } from '../../components/Select/Select.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
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

/** A count card with a status dot (Access Summary and My Access stats). `compact` is the Home tile: a small semibold label. */
export function StatusCount({
  status,
  label,
  value,
  text,
  compact = false,
}: {
  status: string;
  label: string;
  value: number;
  text?: string;
  compact?: boolean;
}) {
  return (
    <div className={cx(styles.stat, compact && styles.statCompact)}>
      <div className={styles.statTop}>
        <span className={compact ? styles.statLabelCompact : styles.statLabel}>{label}</span>
        {DOT[status] && <span className={`${styles.dot} ${DOT[status]}`} aria-hidden="true" />}
      </div>
      <span className={styles.statValue}>{value}</span>
      {text && <span className={styles.statText}>{text}</span>}
    </div>
  );
}

/** Person card (Figma ARS_Person card 10301:2300): avatar, name, email and the person's role as a Tag. */
export function PersonCard({ person, role }: { person: Person; role: 'Owner' | 'Requester' }) {
  return (
    <div className={styles.person}>
      <Avatar name={person.name} src={person.photo} tone={person.tone} size="default" />
      <div className={styles.personText}>
        <span className={styles.personName}>{person.name}</span>
        <span className={styles.personEmail}>{person.email}</span>
      </div>
      <span className={styles.roleTag}>{role}</span>
    </div>
  );
}

/** A Home chart card (Figma BarChartCard 10199:6820): icon and title, a caption, then the chart. */
export function ChartCard({ icon, title, helper, children }: { icon: string; title: string; helper: string; children: ReactNode }) {
  return (
    <section className={styles.chartCard} aria-label={title}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>
          <Icon name={icon} size="24px" />
          {title}
        </h3>
        <p className={styles.chartHelper}>{helper}</p>
      </div>
      {children}
    </section>
  );
}

/**
 * The search box with a submit arrow (Figma ARS_Table_Toolbar 10315:3823). It searches when you press Return or the
 * arrow, as the Advanced Search notes ask (4190:14467).
 */
export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
}) {
  return (
    <form
      role="search"
      className={styles.search}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextInput
        iconLead="MagnifyingGlass"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <Tooltip label="Search">
        <IconButton icon="ArrowRight" size="s" variant="ghost" ariaLabel="Search" type="submit" className={styles.searchSubmit} />
      </Tooltip>
    </form>
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
