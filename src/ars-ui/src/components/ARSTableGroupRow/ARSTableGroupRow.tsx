import { cx } from '@iris/lib/cx.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Link } from '@iris/components/Link/Link.js';
import { CellText, TableCell } from '../../parts/TableCell/TableCell.js';
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
  className,
}: ARSTableGroupRowProps) {
  return (
    <div role="row" className={cx(styles.row, selected && styles.selected, className)}>
      <TableCell inset="s" className={styles.check}>
        <Checkbox checked={selected} onChange={onSelectedChange} ariaLabel={`Select ${name}`} />
      </TableCell>
      <TableCell className={styles.name}>
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
        <IconButton icon="DotsThreeOutline" ariaLabel={`More actions for ${name}`} onClick={onMore} />
      </TableCell>
    </div>
  );
}
