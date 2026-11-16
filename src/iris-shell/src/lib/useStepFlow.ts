import { useCallback, useState } from 'react';
import type { StepperStepItem } from '../components/Stepper/Stepper.js';

/**
 * The steps of a New object form: the step on screen, and which steps can be clicked. Nothing past the first
 * step opens until it is complete; after that, every step reached so far and the one after it can be clicked.
 */
export function useStepFlow(items: StepperStepItem[], firstComplete: boolean) {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);

  const goTo = useCallback((index: number) => {
    setStep(index);
    setFurthest((f) => Math.max(f, index));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setFurthest(0);
  }, []);

  const steps = items.map((s, i) => ({ ...s, disabled: i > 0 && (!firstComplete || i > furthest + 1) }));

  return { step, steps, goTo, reset, last: step === items.length - 1 };
}
