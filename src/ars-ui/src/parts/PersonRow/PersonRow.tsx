import type { MouseEvent } from 'react';
import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import styles from './PersonRow.module.css';

export interface PersonRowProps {
  name: string;
  /** Text beside the name, e.g. "roles2.net/Users". */
  detail?: string;
  /** Edit mode: grey row with Figma's remove (Trash) button. */
  editable?: boolean;
  /** Adds Figma's change (PencilSimple) button to an editable row. */
  showEdit?: boolean;
  onOpen?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
}

/** A person (manager or owner) on the ARS ownership cards. */
export function PersonRow({
  name,
  detail,
  editable = false,
  showEdit = false,
  onOpen,
  onEdit,
  onRemove,
  className,
}: PersonRowProps) {
  return (
    <div className={cx(styles.row, editable && styles.editable, className)}>
      <span className={styles.who}>
        <Link
          href="#"
          className={styles.name}
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            onOpen?.();
          }}
        >
          {name}
        </Link>
        {detail && <span className={styles.detail}>{detail}</span>}
      </span>
      {editable && (
        <span className={styles.actions}>
          {showEdit && <IconButton icon="PencilSimple" ariaLabel={`Change ${name}`} size="s" onClick={onEdit} />}
          <IconButton icon="Trash" ariaLabel={`Remove ${name}`} size="s" onClick={onRemove} />
        </span>
      )}
    </div>
  );
}
