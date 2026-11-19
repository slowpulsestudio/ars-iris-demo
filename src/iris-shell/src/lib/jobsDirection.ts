import { useSyncExternalStore } from 'react';

/**
 * The Background Jobs complexity directions being compared, picked on the welcome page. Each step adds to the one
 * before it (A2 is the step the designer added between A and B):
 * - A: a toast for each state change (started, complete, failed). Nothing else.
 * - A2: the Hourglass button in the top bar, with the jobs in its popover. No panel.
 * - B (MVP): a progress feed under the toast area that can be minimised, closed and reopened from the Hourglass.
 * - C: B with an overall progress bar and Stop.
 * - D: C with every object listed, each with a small spinner and Cancel on hover.
 */
export type JobsDirection = 'a' | 'a2' | 'b' | 'c' | 'd';

export interface JobsDirectionInfo {
  id: JobsDirection;
  letter: string;
  title: string;
  description: string;
}

export const JOBS_DIRECTIONS: JobsDirectionInfo[] = [
  {
    id: 'a',
    letter: 'A',
    title: 'Toasts only',
    description: 'The simplest: one toast for each state change. Job started, job complete, job failed.',
  },
  {
    id: 'a2',
    letter: 'A2',
    title: 'Top bar popover',
    description: 'The Hourglass in the top bar shows a job is running. Click it to see the job in a popover, never a panel.',
  },
  {
    id: 'b',
    letter: 'B',
    title: 'Progress feed (MVP)',
    description: 'A feed under the toast area: "24/100 completed" and a spinner. Minimise, close, and reopen it from the Hourglass.',
  },
  {
    id: 'c',
    letter: 'C',
    title: 'Overall progress and Stop',
    description: 'The feed with an overall progress bar and Stop.',
  },
  {
    id: 'd',
    letter: 'D',
    title: 'Item level progress',
    description: 'The feed with every object listed, each with a small spinner. Hover a row to cancel it.',
  },
];

const KEY = 'ars-jobs-direction';
const listeners = new Set<() => void>();

function read(): JobsDirection {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (JOBS_DIRECTIONS.some((d) => d.id === stored)) return stored as JobsDirection;
  } catch {
    // Storage can be blocked (private mode, embedded webviews); fall back to the MVP.
  }
  return 'b';
}

let current: JobsDirection = read();

export function getJobsDirection(): JobsDirection {
  return current;
}

export function setJobsDirection(direction: JobsDirection): void {
  current = direction;
  try {
    window.localStorage.setItem(KEY, direction);
  } catch {
    // Not remembered across reloads; still applies now.
  }
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useJobsDirection(): JobsDirection {
  return useSyncExternalStore(subscribe, getJobsDirection);
}

export function directionInfo(id: JobsDirection): JobsDirectionInfo {
  return JOBS_DIRECTIONS.find((d) => d.id === id) ?? JOBS_DIRECTIONS[2];
}

/** What each direction shows. */
export const DIRECTION_FEATURES: Record<
  JobsDirection,
  { hourglass: boolean; popover: boolean; feed: boolean; bar: boolean; items: boolean; stateToasts: boolean }
> = {
  a: { hourglass: false, popover: false, feed: false, bar: false, items: false, stateToasts: true },
  a2: { hourglass: true, popover: true, feed: false, bar: false, items: false, stateToasts: true },
  b: { hourglass: true, popover: false, feed: true, bar: false, items: false, stateToasts: false },
  c: { hourglass: true, popover: false, feed: true, bar: true, items: false, stateToasts: false },
  d: { hourglass: true, popover: false, feed: true, bar: true, items: true, stateToasts: false },
};
