import { cx } from '@iris/lib/cx.js';
import { Stepper, type StepperStepItem } from '@iris/components/Stepper/Stepper.js';
import styles from './ARSStepperWithDiv.module.css';

const STEPS: StepperStepItem[] = [
  { id: 'step-1', label: 'Step name' },
  { id: 'step-2', label: 'Step name' },
];

export interface ARSStepperWithDivProps {
  steps?: StepperStepItem[];
  activeIndex?: number;
  className?: string;
}

/**
 * ARS_Stepper_with_div — the Iris Stepper under a top border, with the
 * fading vertical divider that runs down the new-object form. Figma: 3367:11939.
 */
export function ARSStepperWithDiv({ steps = STEPS, activeIndex = 0, className }: ARSStepperWithDivProps) {
  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.divider} aria-hidden="true" />
      <Stepper steps={steps} activeIndex={activeIndex} ariaLabel="Steps" className={styles.stepper} />
    </div>
  );
}
