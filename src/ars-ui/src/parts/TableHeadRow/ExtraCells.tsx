import type { ReactNode } from 'react';
import { CellText, TableCell } from '@iris/components/TableCell/TableCell.js';
import { shownExtras, type ARSColumnSettings } from './columnSettings.js';
import styles from './TableHeadRow.module.css';

export interface ExtraCellsProps {
  settings?: ARSColumnSettings;
  /** The row's text for each added column. */
  values?: Readonly<Record<string, ReactNode>>;
}

/** A row's cells for the columns added with "Add columns", placed before its action cell to line up with the head. */
export function ExtraCells({ settings, values }: ExtraCellsProps) {
  if (!settings) return null;
  return (
    <>
      {shownExtras(settings).map((label) => (
        <TableCell key={label} className={styles.extraCell}>
          <CellText>{values?.[label]}</CellText>
        </TableCell>
      ))}
    </>
  );
}
