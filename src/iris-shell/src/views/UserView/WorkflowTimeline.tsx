import type { ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../../components/Icon/Icon.js';
import styles from './WorkflowTimeline.module.css';

export interface WorkflowStep {
  title: string;
  /** What the step's card holds: read-view rows, a person, or a line of text. */
  content: ReactNode;
}

export interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  /** Index of the step in progress. Earlier steps are done; later ones are to come. Past the end, all are done. */
  current: number;
  className?: string;
}

/**
 * WorkflowTimeline — a request's steps down a keyline: done steps with a check, the current one numbered in
 * the brand colour with its card outlined, and the steps to come numbered. Figma: ARS_Workflow
 * timeline_Content 10315:3374 (Review Request, Request steps 10315:2999).
 */
export function WorkflowTimeline({ steps, current, className }: WorkflowTimelineProps) {
  return (
    <ol className={cx(styles.root, className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'next';
        return (
          <li key={step.title} className={styles.step} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <div className={styles.head}>
              {state === 'done' ? (
                <Icon name="CheckCircle" size="18px" className={styles.check} />
              ) : (
                <span className={styles.number} aria-hidden="true">
                  {i + 1}
                </span>
              )}
              <span className={styles.title}>{step.title}</span>
            </div>
            <div className={styles.body}>
              <div className={styles.card}>{step.content}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** A label and value on one line inside a step card (Figma ARS_Read_View_Row). */
export function StepRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
