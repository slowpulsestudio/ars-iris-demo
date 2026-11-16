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
  /** Hides the stepper for single-form create actions, as ARS_New_Organizational_Unit does (OU file 1394:14744). */
  showStepper?: boolean;
  activeIndex?: number;
  interactive?: boolean;
  onStepSelect?: (index: number) => void;
  /** Sizes the body to its content instead of Figma's fixed 729px. */
  fitContent?: boolean;
  /** Replaces the content, as ARS_New_Object_Template does. */
  children?: ReactNode;
  /**
   * Every step's content in step order, in place of `children`. They share one cell, so the body is as tall as
   * the tallest step on every step (decided UI rule MOD-1); only the active step shows.
   */
  stepContents?: ReactNode[];
  className?: string;
}

/**
 * ARS_New_Object_Content_Container — the new-object modal body: the stepper
 * pinned above the form. Figma: 3367:12347; spacing and lines as ARS_WebUI2_CRUD 3663:22067.
 */
export function ARSNewObjectContentContainer({
  steps = STEPS,
  showStepper = true,
  activeIndex = 0,
  interactive,
  onStepSelect,
  fitContent = false,
  children,
  stepContents,
  className,
}: ARSNewObjectContentContainerProps) {
  return (
    <div className={cx(styles.root, fitContent && styles.fit, className)}>
      {showStepper && (
        <ARSStepperWithDiv
          steps={steps}
          activeIndex={activeIndex}
          interactive={interactive}
          onStepSelect={onStepSelect}
          className={styles.stepper}
        />
      )}
      <div className={cx(styles.content, showStepper && styles.withStepper)}>
        {stepContents ? (
          <div className={styles.steps}>
            {stepContents.map((content, i) => (
              <div key={i} className={cx(styles.step, i !== activeIndex && styles.hiddenStep)} inert={i !== activeIndex}>
                {content}
              </div>
            ))}
          </div>
        ) : (
          (children ?? <ARSNewObjectContent layout="container" />)
        )}
      </div>
    </div>
  );
}
