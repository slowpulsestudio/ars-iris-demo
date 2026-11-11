import { useEffect, useState } from 'react';
import {
  ARSUsersContactInfoCard,
  ARSUsersJobInfoCard,
  CONTACT_INFO_ROWS,
  JOB_INFO_FIELDS,
  JOB_INFO_ROWS,
  type DetailsRow,
  type FormInputProps,
} from '@ars';
import { saveUserDetailValues, useUserDetailValues } from '../../lib/userDetailsStore.js';
import styles from './UserObjectPage.module.css';

type CardId = 'contact' | 'job';
type Values = Record<string, string>;

const key = (label: string) => label.toLowerCase();
const text = (value: DetailsRow['value']) => (typeof value === 'string' ? value : '');

/** Contact information edits the same labels as its rows (Figma's edit variant of this card shows the job fields). */
const contactLabels = CONTACT_INFO_ROWS.map((r) => r.label);

export interface UserDetailsTabProps {
  userId: string;
  email: string;
  /** Tells the page whether a card has unsaved changes. */
  onDirtyChange: (dirty: boolean) => void;
  /** Runs `action` now, or after the user confirms discarding changes. */
  requestLeave: (action: () => void) => void;
}

/**
 * UserDetailsTab — the User Details tab: Contact information and Job
 * information (ARS_Users_ContactInfo Card, ARS_Users_Job Info Card), each read
 * or edited on its own.
 */
export function UserDetailsTab({ userId, email, onDirtyChange, requestLeave }: UserDetailsTabProps) {
  const edited = useUserDetailValues(userId);
  // The values being typed, per card; absent when the card isn't being edited.
  const [drafts, setDrafts] = useState<Partial<Record<CardId, Values>>>({});

  const rowsFor = (rows: DetailsRow[]): DetailsRow[] =>
    rows.map((r) => ({
      label: r.label,
      value: edited[key(r.label)] ?? (r.label === 'Email' ? email : r.value),
    }));

  const current = (label: string, rows: DetailsRow[]): string =>
    text(rowsFor(rows).find((r) => key(r.label) === key(label))?.value);

  const dirtyCards = (Object.keys(drafts) as CardId[]).filter((id) => {
    const rows = id === 'contact' ? CONTACT_INFO_ROWS : JOB_INFO_ROWS;
    return Object.entries(drafts[id] ?? {}).some(([k, v]) => v !== current(k, rows));
  });
  const dirty = dirtyCards.length > 0;

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const start = (id: CardId, rows: DetailsRow[]) =>
    setDrafts((d) => ({ ...d, [id]: Object.fromEntries(rowsFor(rows).map((r) => [key(r.label), text(r.value)])) }));

  const stop = (id: CardId) =>
    setDrafts((d) => {
      const { [id]: _removed, ...rest } = d;
      return rest;
    });

  const fieldsFor = (id: CardId, labels: FormInputProps[]): FormInputProps[] =>
    labels.map((f) => ({
      ...f,
      value: drafts[id]?.[key(f.label)] ?? '',
      onChange: (value: string) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [key(f.label)]: value } })),
    }));

  const save = (id: CardId) => {
    saveUserDetailValues(userId, drafts[id] ?? {});
    stop(id);
  };

  const cancel = (id: CardId) => (dirtyCards.includes(id) ? requestLeave(() => stop(id)) : stop(id));

  return (
    <div className={styles.stack}>
      <ARSUsersContactInfoCard
        rows={rowsFor(CONTACT_INFO_ROWS)}
        fields={fieldsFor(
          'contact',
          contactLabels.map((label) => ({ label, width: 280 })),
        )}
        editing={drafts.contact !== undefined}
        onEdit={() => start('contact', CONTACT_INFO_ROWS)}
        onCancel={() => cancel('contact')}
        onSave={() => save('contact')}
      />
      <ARSUsersJobInfoCard
        rows={rowsFor(JOB_INFO_ROWS)}
        fields={fieldsFor('job', JOB_INFO_FIELDS)}
        editing={drafts.job !== undefined}
        onEdit={() => start('job', JOB_INFO_ROWS)}
        onCancel={() => cancel('job')}
        onSave={() => save('job')}
      />
    </div>
  );
}
