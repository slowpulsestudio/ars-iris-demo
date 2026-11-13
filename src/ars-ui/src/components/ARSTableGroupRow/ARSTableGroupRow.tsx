import { cx } from '@iris/lib/cx.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { CellText, TableCell } from '@iris/components/TableCell/TableCell.js';
import styles from './ARSTableGroupRow.module.css';

export interface ARSTableGroupRowProps {
  name: string;
  objectType?: string;
  description: string;
  objectId: string;
  href?: string;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onMore?: () => void;
  /**
   * "Memberships" is a row of the Groups file's ARS_Group_Object_Memberships table (167:8097): the type icon,
   * the name in primary text, a 165px Object Type and a remove button in place of "…".
   */
  variant?: 'Groups' | 'Memberships';
  /** Memberships: the object's type icon before the name (People/UsersThree, People/User; 167:8348). */
  icon?: string;
  /** Memberships: the remove button at the end of the row (Finance/XCircle, 167:8103). */
  onRemove?: () => void;
  className?: string;
}

/**
 * ARS_Table_Group_Row — one group in ARS_Group_Table. Hovered and selected
 * rows turn grey and the name turns link-hover blue (Figma's 2 and 3
 * variants). Figma: 2843:24711.
 */
export function ARSTableGroupRow({
  name,
  objectType = 'O365Group',
  description,
  objectId,
  href = '#',
  selected = false,
  onSelectedChange,
  onMore,
  variant = 'Groups',
  icon,
  onRemove,
  className,
}: ARSTableGroupRowProps) {
  const memberships = variant === 'Memberships';
  return (
    <div role="row" className={cx(styles.row, memberships && styles.memberships, selected && styles.selected, className)}>
      <TableCell inset="s" className={styles.check}>
        <Checkbox checked={selected} onChange={onSelectedChange} ariaLabel={`Select ${name}`} />
      </TableCell>
      <TableCell className={styles.name}>
        {memberships && icon && (
          <span className={styles.typeIcon} aria-hidden="true">
            <Icon name={icon} size="20px" />
          </span>
        )}
        <Link href={href} className={styles.nameLink}>
          {name}
        </Link>
      </TableCell>
      <TableCell className={styles.type}>
        <CellText>{objectType}</CellText>
      </TableCell>
      <TableCell className={styles.description}>
        <CellText>{description}</CellText>
      </TableCell>
      <TableCell gap="s" className={styles.fill}>
        <CellText>{objectId}</CellText>
      </TableCell>
      <TableCell inset="button" divider={false}>
        {memberships ? (
          <IconButton icon="XCircle" ariaLabel={`Remove ${name}`} onClick={onRemove} />
        ) : (
          <IconButton icon="DotsThreeOutline" ariaLabel={`More actions for ${name}`} onClick={onMore} />
        )}
      </TableCell>
    </div>
  );
}
