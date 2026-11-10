import type { ReactNode } from 'react';
import styles from './ObjectTitle.module.css';

export interface ObjectTitleProps {
  title: string;
  /** Supporting text, e.g. "User". */
  objectClass?: string;
  /** Supporting text after the dot, e.g. "Entra1". */
  objectName?: string;
  /** Shows the "objectClass · objectName" line. */
  supporting?: boolean;
  /** Controls after the supporting text, e.g. ARS_Header's Customize gear. */
  supportingAction?: ReactNode;
}

/** The title and "class · name" line beside an object icon in the ARS headers. */
export function ObjectTitle({ title, objectClass, objectName, supporting = true, supportingAction }: ObjectTitleProps) {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      {supporting && (
        <div className={styles.supportingRow}>
          <p className={styles.supporting}>
            {objectClass}
            <span className={styles.dot}> · </span>
            {objectName}
          </p>
          {supportingAction}
        </div>
      )}
    </div>
  );
}
