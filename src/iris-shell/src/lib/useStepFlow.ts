import { useCallback, useState } from 'react';
import type { StepperStepItem } from '../components/Stepper/Stepper.js';
import { setHashParams, useHashParam } from './hashState.js';

/**
 * The steps of a New object form. A link can open any step; normal navigation still requires the first
 * step to be complete before advancing.
 */
export function useStepFlow(items: StepperStepItem[], firstComplete: boolean, open: boolean) {
  const [stepParam] = useHashParam('step');
  const requestedStep = open ? items.findIndex((item) => item.id === stepParam) : -1;
  const step = requestedStep < 0 ? 0 : requestedStep;
  const [furthest, setFurthest] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= items.length) return;
    setHashParams({ step: index === 0 ? null : items[index].id });
    setFurthest((f) => Math.max(f, index));
  }, [items]);

  const reset = useCallback(() => {
    setFurthest(0);
  }, []);

  const steps = items.map((s, i) => ({ ...s, disabled: i > 0 && i !== step && (!firstComplete || i > Math.max(furthest, step) + 1) }));

  return { step, steps, goTo, reset, last: step === items.length - 1 };
}
