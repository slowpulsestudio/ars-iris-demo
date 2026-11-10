import { Button } from '@iris/components/Button/Button.js';
import { Card } from '@iris/components/Card/Card.js';
import { cx } from '@iris/lib/cx.js';
import { FormInput, type FormInputProps } from '../FormInput/FormInput.js';
import styles from './DetailsCard.module.css';

export interface DetailsRow {
  label: string;
  value?: string;
}

export interface DetailsCardProps {
  title: string;
  helper: string;
  /** Edit mode shows `fields` with Cancel / Save; read mode shows `rows` with Edit. */
  editing: boolean;
  rows: DetailsRow[];
  /** An inner array puts fields side by side. */
  fields?: (FormInputProps | FormInputProps[])[];
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
  onEdit,
  onCancel,
  onSave,
  className,
}: DetailsCardProps) {
  const actions = editing ? (
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
    <Card title={title} helper={helper} actions={actions} className={cx(styles.card, className)}>
      {editing ? (
        <div className={styles.fields}>
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
        <dl className={styles.rows}>
          {rows.map((row, i) => (
            <div key={i} className={styles.row}>
              <dt className={styles.label}>{row.label}</dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}
