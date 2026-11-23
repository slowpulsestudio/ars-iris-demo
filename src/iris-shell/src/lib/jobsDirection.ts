import { useSyncExternalStore } from 'react';
import { MOCK_USERS } from '../views/UsersPage/mockUsers.js';
import { isEntraLocation } from './directoryFilter.js';

/**
 * The Background Jobs complexity directions being compared, picked on the welcome page. Each step adds to the one
 * before it; A is the recommended one:
 * - A: a toast for each state change (started, complete, failed). Nothing else.
 * - B: the Hourglass button in the top bar, with the jobs in its popover. No feed.
 * - C (MVP): a progress feed under the toast area that can be minimised, closed and reopened from the Hourglass.
 * - D: C with an overall progress bar and Stop.
 * - E: D with every object listed, each with a small spinner and Cancel on hover.
 */
export type JobsDirection = 'a' | 'b' | 'c' | 'd' | 'e';

export interface JobsDirectionInfo {
  id: JobsDirection;
  letter: string;
  title: string;
  /** A short line about the direction, for tooltips. */
  description: string;
  /** Recommended directions get the larger cards on the welcome page. */
  recommended: boolean;
  /** 1 (simplest) to 5; the letters and numbers run in this order. */
  complexity: number;
  /** Picture of the direction's component, in public/directions/. */
  image: string;
}

export const JOBS_DIRECTIONS: JobsDirectionInfo[] = [
  {
    id: 'a',
    letter: 'A',
    title: 'Toasts only',
    description: 'One toast for each state change: job started, job complete, job failed.',
    recommended: true,
    complexity: 1,
    image: '/directions/a-toasts-only.png',
  },
  {
    id: 'b',
    letter: 'B',
    title: 'Top bar: popover only',
    description: 'The Hourglass in the top bar shows a job is running; click it to see the job in a popover. Shows progress is happening, but spinner only.',
    recommended: false,
    complexity: 2,
    image: '/directions/b-top-bar-popover.png',
  },
  {
    id: 'c',
    letter: 'C',
    title: 'Bottom tray: simple',
    description: 'A feed under the toast area titled "Moving 100 users", with a spinner. Minimise, close, reopen from the Hourglass. Shows progress is happening, but spinner only.',
    recommended: false,
    complexity: 3,
    image: '/directions/c-progress-feed.png',
  },
  {
    id: 'd',
    letter: 'D',
    title: 'Bottom tray: overall progress',
    description: 'The feed with an overall progress bar and Stop.',
    recommended: false,
    complexity: 4,
    image: '/directions/d-progress-bar.png',
  },
  {
    id: 'e',
    letter: 'E',
    title: 'Bottom tray: item progress',
    description: 'The feed with every object listed, each with a small spinner. Hover a row to cancel it.',
    recommended: false,
    complexity: 5,
    image: '/directions/e-item-level-progress.png',
  },
];

/** Where every direction starts: the Users list with every AD user ticked, so Move is one click away (Entra users can't be moved). */
export const JOBS_START_ROUTE = `#/users?select=${MOCK_USERS.filter((u) => !isEntraLocation(u.location))
  .map((u) => u.id)
  .join(',')}`;

const KEY = 'ars-jobs-direction-v2';
const listeners = new Set<() => void>();

function read(): JobsDirection {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (JOBS_DIRECTIONS.some((d) => d.id === stored)) return stored as JobsDirection;
  } catch {
    // Storage can be blocked (private mode, embedded webviews); fall back to the MVP.
  }
  return 'c';
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

/** What each direction shows. `count` is the "24/100 completed" count; B and C name the total in the title instead. */
export const DIRECTION_FEATURES: Record<
  JobsDirection,
  { hourglass: boolean; popover: boolean; feed: boolean; bar: boolean; items: boolean; stateToasts: boolean; count: boolean }
> = {
  a: { hourglass: false, popover: false, feed: false, bar: false, items: false, stateToasts: true, count: true },
  b: { hourglass: true, popover: true, feed: false, bar: false, items: false, stateToasts: true, count: false },
  c: { hourglass: true, popover: false, feed: true, bar: false, items: false, stateToasts: false, count: false },
  d: { hourglass: true, popover: false, feed: true, bar: true, items: false, stateToasts: false, count: true },
  e: { hourglass: true, popover: false, feed: true, bar: true, items: true, stateToasts: false, count: true },
};
