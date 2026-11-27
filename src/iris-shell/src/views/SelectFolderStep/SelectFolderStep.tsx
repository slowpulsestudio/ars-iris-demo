import { useId, useState } from 'react';
import { FolderArrowRightIcon } from '@ars';
import type { StepperStepItem } from '../../components/Stepper/Stepper.js';
import { FolderTree } from '../FolderTree/FolderTree.js';
import styles from './SelectFolderStep.module.css';

/** The step's tab in a New object form's stepper (Figma 3651:20393). */
export const SELECT_FOLDER_STEP: StepperStepItem = { id: 'folder', label: 'Select folder' };

export interface SelectFolderStepProps {
  /** Names what the folder is for, in the supporting text. */
  objectName: string;
  /** Where the object goes now (the location under the modal title); the tree opens at it. */
  destinationId: string | null;
  /** Called as soon as a folder is selected. */
  onSelect: (id: string) => void;
}

/**
 * SelectFolderStep — the Select folder step of New AD User and New AD Group (ARS_WebUI2_CRUD 3651:20393): the
 * Select folder sheet's content as the last step. Selecting a folder in Active Directory makes it the destination.
 */
export function SelectFolderStep({ objectName, destinationId, onSelect }: SelectFolderStepProps) {
  const titleId = useId();
  // Start without a tick, but keep the tree open at the current destination.
  const [choice, setChoice] = useState<string | null>(null);

  const chooseFolder = (id: string) => {
    setChoice(id);
    onSelect(id);
  };

  return (
    <section className={styles.root} aria-labelledby={titleId}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <FolderArrowRightIcon />
        </span>
        <div className={styles.heading}>
          <h3 id={titleId} className={styles.title}>
            Select folder
          </h3>
          <p className={styles.subtitle}>Browse and select a destination folder for {objectName}</p>
        </div>
      </div>
      <div className={styles.folders}>
        <FolderTree selectedId={choice} onSelect={chooseFolder} openAtId={destinationId} activeDirectoryOnly flush />
      </div>
    </section>
  );
}
