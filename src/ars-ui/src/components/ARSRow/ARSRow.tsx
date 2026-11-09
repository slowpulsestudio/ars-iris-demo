import { cx } from '@iris/lib/cx.js';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { CellText, TableCell } from '../../parts/TableCell/TableCell.js';
import { TagList } from '../../parts/Tag/Tag.js';
import styles from './ARSRow.module.css';

export interface ARSRowProps {
  /** Figma "Property 1": a user row, or a row in a mixed-object list. */
  variant?: 'User' | 'Mixed';
  name: string;
  /** Icon on the name cell's button. */
  icon?: string;
  /** User rows: status badge text. */
  status?: string;
  statusTone?: BadgeTone;
  /** User rows. */
  description?: string;
  /** Mixed rows: the object's type, e.g. "User". */
  objectType?: string;
  tags?: string[];
  location?: string;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onOpen?: () => void;
  onMore?: () => void;
  onRemoveTag?: (tag: string) => void;
  className?: string;
}

/** ARS_Row — one object row of the ARS directory table. Figma: 111:29461. */
export function ARSRow({
  variant = 'User',
  name,
  icon = 'User',
  status,
  statusTone = 'success',
  description,
  objectType,
  tags = [],
  location,
  selected = false,
  onSelectedChange,
  onOpen,
  onMore,
  onRemoveTag,
  className,
}: ARSRowProps) {
  const isUser = variant === 'User';
  return (
    <div role="row" className={cx(styles.row, className)}>
      <TableCell inset="s" className={styles.check}>
        <Checkbox checked={selected} onChange={onSelectedChange} ariaLabel={`Select ${name}`} />
      </TableCell>
      <TableCell className={styles.name}>
        <IconButton icon={icon} ariaLabel={`Open ${name}`} onClick={onOpen} />
        <CellText strong>{name}</CellText>
      </TableCell>
      {isUser ? (
        <>
          <TableCell className={styles.status}>
            {status && <Badge tone={statusTone}>{status}</Badge>}
          </TableCell>
          <TableCell className={styles.fill}>
            <CellText>{description}</CellText>
          </TableCell>
          <TableCell className={styles.tagsUser}>
            <TagList tags={tags} onRemove={onRemoveTag} />
          </TableCell>
          <TableCell gap="s" className={styles.location}>
            <CellText>{location}</CellText>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className={styles.type}>
            <CellText>{objectType}</CellText>
          </TableCell>
          <TableCell className={styles.tagsMixed}>
            <TagList tags={tags} onRemove={onRemoveTag} />
          </TableCell>
          <TableCell gap="s" className={styles.fill}>
            <CellText>{location}</CellText>
          </TableCell>
        </>
      )}
      <TableCell inset="button" divider={false}>
        <IconButton icon="DotsThree" ariaLabel={`More actions for ${name}`} onClick={onMore} />
      </TableCell>
    </div>
  );
}
