import { cx } from '@iris/lib/cx.js';
import { GhostButton } from '../../parts/GhostButton/GhostButton.js';
import { NotSet, OwnerList, OwnerSection, type OwnerPerson } from '../../parts/OwnerSection/OwnerSection.js';
import styles from './ARSOwnership.module.css';

export type ARSOwnershipVariant = 'Manager' | 'Secondary owner';
export type ARSOwnershipState = 'Empty' | 'Add' | 'Read state' | 'Edit state';

const MANAGER: OwnerPerson[] = [{ name: 'Marcus Kim' }];
const OWNERS: OwnerPerson[] = [
  { name: 'Emily Park', detail: 'roles2.net/Users' },
  { name: 'Peter Smith', detail: 'roles2.net/Users' },
];

export interface ARSOwnershipProps {
  /** Figma "Variant". */
  variant?: ARSOwnershipVariant;
  /** Figma "State". */
  state?: ARSOwnershipState;
  onAdd?: () => void;
  onOpen?: (person: OwnerPerson) => void;
  onEdit?: (person: OwnerPerson) => void;
  onRemove?: (person: OwnerPerson) => void;
  className?: string;
}

/**
 * ARS_Ownership — the manager or secondary owners of an object, in its empty,
 * add, read and edit states. Figma: 3527:16049.
 */
export function ARSOwnership({
  variant = 'Manager',
  state = 'Empty',
  onAdd,
  onOpen,
  onEdit,
  onRemove,
  className,
}: ARSOwnershipProps) {
  const manager = variant === 'Manager';
  const editing = state === 'Add' || state === 'Edit state';
  const list = (
    <OwnerList
      people={manager ? MANAGER : OWNERS}
      editable={state === 'Edit state'}
      showEdit={manager}
      onOpen={onOpen}
      onEdit={onEdit}
      onRemove={onRemove}
    />
  );
  const add = (
    <GhostButton iconLead="Plus" onClick={onAdd}>
      {manager ? 'Add manager' : 'Add owner'}
    </GhostButton>
  );

  return (
    <OwnerSection
      label={manager ? 'Manager' : 'Secondary owners'}
      editing={editing}
      className={cx(styles.root, className)}
    >
      {state === 'Empty' ? (
        <NotSet />
      ) : state === 'Add' ? (
        add
      ) : manager ? (
        list
      ) : (
        <>
          {list}
          {add}
        </>
      )}
    </OwnerSection>
  );
}
