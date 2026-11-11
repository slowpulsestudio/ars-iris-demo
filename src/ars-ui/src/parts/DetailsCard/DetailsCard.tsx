import type { ReactNode } from 'react';
import { Button } from '@iris/components/Button/Button.js';
import { cx } from '@iris/lib/cx.js';
import { Card } from '../Card/Card.js';
import { DetailsList, type DetailsRow } from '../DetailsList/DetailsList.js';
import { FormInput, type FormInputProps } from '../FormInput/FormInput.js';
import styles from './DetailsCard.module.css';

export type { DetailsRow };

export interface DetailsCardProps {
  title: string;
  helper?: string;
  /** Edit mode shows `fields` with Cancel / Save; read mode shows `rows` with Edit. */
  editing: boolean;
  rows: DetailsRow[];
  /** An inner array puts fields side by side. */
  fields?: (FormInputProps | FormInputProps[])[];
  /** Replaces the Edit / Cancel + Save buttons. */
  actions?: ReactNode;
  /** Label column width in px, passed to DetailsList. */
  labelWidth?: number;
  /** 8px between fields instead of 16px, as on the group card. */
  compactFields?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}

/** The ARS user-page card: label/value rows, or the same details as form fields. */
export function DetailsCard({
  title,
  helper,
  editing,
  rows,
  fields = [],
  actions,
  labelWidth,
  compactFields = false,
  onEdit,
  onCancel,
  onSave,
  className,
}: DetailsCardProps) {
  const defaultActions = editing ? (
    <div className={styles.actions}>
      <Button variant="secondary" size="s" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="s" onClick={onSave}>
        Save
      </Button>
    </div>
  ) : (
    <Button variant="secondary" size="s" onClick={onEdit}>
      Edit
    </Button>
  );

  return (
    <Card
      title={title}
      helper={helper}
      actions={actions ?? defaultActions}
      className={className}
    >
      {editing ? (
        <div className={cx(styles.fields, compactFields && styles.compact)}>
          {fields.map((field, i) =>
            Array.isArray(field) ? (
              <div key={i} className={styles.fieldRow}>
                {field.map((f) => (
                  <FormInput key={f.label} {...f} />
                ))}
              </div>
            ) : (
              <FormInput key={i} {...field} />
            ),
          )}
        </div>
      ) : (
        <DetailsList rows={rows} labelWidth={labelWidth} />
      )}
    </Card>
  );
}
