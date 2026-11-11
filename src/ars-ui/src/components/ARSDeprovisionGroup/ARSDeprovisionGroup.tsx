import { Button } from '@iris/components/Button/Button.js';
import { ModalPanel } from '../../parts/ModalPanel/ModalPanel.js';
import styles from './ARSDeprovisionGroup.module.css';

export interface ARSDeprovisionGroupProps {
  /** The group's name, shown in the question. */
  name: string;
  onClose?: () => void;
  onNo?: () => void;
  onYes?: () => void;
  className?: string;
}

/**
 * Deprovision AD Group modal: a Yes or No confirmation. Missing from Figma as a
 * frame: the ARS_WebUI2_Groups file only has the written requirement (64:6805).
 * Built on the ARS 620px modal panel.
 */
export function ARSDeprovisionGroup({ name, onClose, onNo, onYes, className }: ARSDeprovisionGroupProps) {
  return (
    <ModalPanel
      icon="Prohibit"
      title="Deprovision AD Group"
      onClose={onClose}
      className={className}
      actions={
        <>
          <Button variant="secondary" onClick={onNo}>
            No
          </Button>
          <Button onClick={onYes}>Yes</Button>
        </>
      }
    >
      <p className={styles.message}>Are you sure you want to deprovision {name}?</p>
    </ModalPanel>
  );
}
