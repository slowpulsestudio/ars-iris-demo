import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { PersonRow } from '../PersonRow/PersonRow.js';
import styles from './OwnerSection.module.css';

export interface OwnerPerson {
  name: string;
  detail?: string;
}

export interface OwnerSectionProps {
  label: string;
  /** Edit look: Figma's bold field label instead of the grey read label. */
  editing?: boolean;
  children: ReactNode;
  className?: string;
}

/** A labelled block on the ARS ownership cards ("Manager", "Secondary owners"). */
export function OwnerSection({ label, editing = false, children, className }: OwnerSectionProps) {
  return (
    <div className={cx(styles.section, className)}>
      <span className={editing ? styles.fieldLabel : styles.label}>{label}</span>
      {children}
    </div>
  );
}

/** Figma's empty value: "Not set". */
export function NotSet() {
  return <div className={styles.notSet}>Not set</div>;
}

export interface OwnerListProps {
  people: OwnerPerson[];
  editable?: boolean;
  showEdit?: boolean;
  onOpen?: (person: OwnerPerson) => void;
  onEdit?: (person: OwnerPerson) => void;
  onRemove?: (person: OwnerPerson) => void;
}

/** People rows, 576px wide as in Figma. */
export function OwnerList({ people, editable, showEdit, onOpen, onEdit, onRemove }: OwnerListProps) {
  return (
    <div className={styles.people}>
      {people.map((p) => (
        <PersonRow
          key={p.name}
          {...p}
          editable={editable}
          showEdit={showEdit}
          onOpen={onOpen && (() => onOpen(p))}
          onEdit={onEdit && (() => onEdit(p))}
          onRemove={onRemove && (() => onRemove(p))}
        />
      ))}
    </div>
  );
}
