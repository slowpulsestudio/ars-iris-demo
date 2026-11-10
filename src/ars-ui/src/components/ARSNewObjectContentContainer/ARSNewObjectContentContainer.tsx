import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import type { StepperStepItem } from '@iris/components/Stepper/Stepper.js';
import { ARSNewObjectContent } from '../ARSNewObjectContent/ARSNewObjectContent.js';
import { ARSStepperWithDiv } from '../ARSStepperWithDiv/ARSStepperWithDiv.js';
import styles from './ARSNewObjectContentContainer.module.css';

const STEPS: StepperStepItem[] = [
  { id: 'general', label: 'General' },
  { id: 'step-2', label: 'Step name' },
];

export interface ARSNewObjectContentContainerProps {
  steps?: StepperStepItem[];
  activeIndex?: number;
  interactive?: boolean;
  onStepSelect?: (index: number) => void;
  /** Replaces the content, as ARS_New_Object_Template does. */
  children?: ReactNode;
  className?: string;
}

/**
 * ARS_New_Object_Content_Container — the new-object modal body: the stepper
 * pinned above the form. Figma: 3367:12347.
 */
export function ARSNewObjectContentContainer({
  steps = STEPS,
  activeIndex = 0,
  interactive,
  onStepSelect,
  children,
  className,
}: ARSNewObjectContentContainerProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSStepperWithDiv
        steps={steps}
        activeIndex={activeIndex}
        interactive={interactive}
        onStepSelect={onStepSelect}
        className={styles.stepper}
      />
      <div className={styles.content}>{children ?? <ARSNewObjectContent layout="container" />}</div>
    </div>
  );
}
