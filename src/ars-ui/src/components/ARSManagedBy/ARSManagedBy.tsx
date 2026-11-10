import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Card } from '@iris/components/Card/Card.js';
import { DetailsList, type DetailsRow } from '../../parts/DetailsList/DetailsList.js';
import { FormInput, type FormInputProps } from '../../parts/FormInput/FormInput.js';
import { NotSet, OwnerList, OwnerSection, type OwnerPerson } from '../../parts/OwnerSection/OwnerSection.js';
import styles from './ARSManagedBy.module.css';

export type ARSManagedByState = 'Empty' | 'Hover' | 'Add manager' | 'Edit mode' | 'Filled';

const EMPTY_ROWS: DetailsRow[] = [
  { label: 'Office', value: '-' },
  { label: 'Street address', value: '-' },
  { label: 'City', value: '-' },
  { label: 'State/Proviance', value: '-' },
  { label: 'Country/Region', value: '-' },
  { label: 'Telephone number', value: '-' },
  { label: 'Fax number', value: '-' },
];

const FILLED_ROWS: DetailsRow[] = [
  { label: 'Office', value: 'London HQ' },
  { label: 'Street address', value: '123 Baker Street' },
  { label: 'City', value: 'London' },
  { label: 'State/Provance', value: 'Greater London' },
  { label: 'Country/Reigon', value: 'United Kingdom' },
  { label: 'Telephone number', value: '01268 888000' },
  { label: 'Fax number', value: '01268 888000' },
];

// Figma spells the labels differently in its two edit variants; both are kept.
const fields = (labels: string[]): FormInputProps[] => [
  { label: labels[0], value: 'London HQ', width: 280 },
  { label: labels[1], value: '123 Baker Street', width: 280 },
  { label: labels[2], value: 'London', width: 280 },
  { label: labels[3], value: 'Greater London', width: 280 },
  { label: labels[4], value: '01268 888000', width: 280 },
  { label: 'Country/Region', value: 'United Kingdom', width: 280, select: true },
];
const ADD_FIELDS = fields(['Office', 'Street address', 'City', 'State/Province', 'ZIP/Postal code']);
const EDIT_FIELDS = fields(['Office', 'Street Address', 'City', 'State/Provance', 'ZIP/Postal Code']);

const MANAGER: OwnerPerson[] = [{ name: 'Marcus Kim' }];
const OWNERS: OwnerPerson[] = [
  { name: 'Emily Park', detail: 'roles2.net/Users' },
  { name: 'Peter Smith', detail: 'roles2.net/Users' },
];

export interface ARSManagedByProps {
  /** Figma "State". */
  state?: ARSManagedByState;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onAddManager?: () => void;
  onAddOwner?: () => void;
  className?: string;
}

/**
 * ARS_Managed_by — who manages the object, with office details and secondary
 * owners. Hovering a read card fills it grey and shows Edit (Figma's Hover).
 * Figma: 3527:16182.
 */
export function ARSManagedBy({
  state = 'Empty',
  onEdit,
  onCancel,
  onSave,
  onAddManager,
  onAddOwner,
  className,
}: ARSManagedByProps) {
  const editing = state === 'Add manager' || state === 'Edit mode';
  const filled = state === 'Filled';

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
    <Button variant="secondary" size="s" className={styles.edit} onClick={onEdit}>
      Edit
    </Button>
  );

  const manager =
    state === 'Add manager' ? (
      <Button variant="ghost" size="s" iconLead="Plus" onClick={onAddManager}>
        Add manager
      </Button>
    ) : state === 'Edit mode' || filled ? (
      <OwnerList people={MANAGER} editable={state === 'Edit mode'} showEdit />
    ) : (
      <NotSet />
    );

  return (
    <Card
      title="Managed by"
      actions={actions}
      className={cx(styles.card, !editing && styles.readable, state === 'Hover' && styles.hovered, className)}
    >
      <div className={styles.body}>
        <OwnerSection label="Manager" editing={editing}>
          {manager}
        </OwnerSection>
        {editing ? (
          <div className={styles.grid}>
            {(state === 'Add manager' ? ADD_FIELDS : EDIT_FIELDS).map((f) => (
              <FormInput key={f.label} {...f} />
            ))}
          </div>
        ) : (
          <DetailsList rows={filled ? FILLED_ROWS : EMPTY_ROWS} />
        )}
        <OwnerSection label="Secondary owners" editing={editing}>
          {editing ? (
            <>
              {state === 'Edit mode' && <OwnerList people={OWNERS} editable />}
              <Button variant="ghost" size="s" iconLead="Plus" onClick={onAddOwner}>
                Add owner
              </Button>
            </>
          ) : filled ? (
            <OwnerList people={OWNERS} />
          ) : (
            <NotSet />
          )}
        </OwnerSection>
      </div>
    </Card>
  );
}
