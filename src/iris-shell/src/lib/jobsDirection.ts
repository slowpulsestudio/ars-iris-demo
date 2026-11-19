import { useSyncExternalStore } from 'react';
import { MOCK_USERS } from '../views/UsersPage/mockUsers.js';
import { isEntraLocation } from './directoryFilter.js';

/**
 * The Background Jobs complexity directions being compared, picked on the welcome page. Each step adds to the one
 * before it; B1 and B2 are the recommended pair:
 * - A: a toast for each state change (started, complete, failed). Nothing else.
 * - B1: the Hourglass button in the top bar, with the jobs in its popover. No feed.
 * - B2 (MVP): a progress feed under the toast area that can be minimised, closed and reopened from the Hourglass.
 * - C: B2 with an overall progress bar and Stop.
 * - D: C with every object listed, each with a small spinner and Cancel on hover.
 */
export type JobsDirection = 'a' | 'b1' | 'b2' | 'c' | 'd';

export interface JobsDirectionInfo {
  id: JobsDirection;
  letter: string;
  title: string;
  /** A short line about the direction, for tooltips. */
  description: string;
  /** Recommended directions get the larger cards on the welcome page. */
  recommended: boolean;
  /** Picture of the direction's component, in public/directions/. */
  image: string;
}

export const JOBS_DIRECTIONS: JobsDirectionInfo[] = [
  {
    id: 'a',
    letter: 'A',
    title: 'Toasts only',
    description: 'One toast for each state change: job started, job complete, job failed.',
    recommended: false,
    image: '/directions/a-toasts-only.png',
  },
  {
    id: 'b1',
    letter: 'B1',
    title: 'Top Bar Popover',
    description: 'The Hourglass in the top bar shows a job is running; click it to see the job in a popover.',
    recommended: true,
    image: '/directions/b1-top-bar-popover.png',
  },
  {
    id: 'b2',
    letter: 'B2',
    title: 'Progress Feed (MVP)',
    description: 'A feed under the toast area with "24/100 completed" and a spinner. Minimise, close, reopen from the Hourglass.',
    recommended: true,
    image: '/directions/b2-progress-feed.png',
  },
  {
    id: 'c',
    letter: 'C',
    title: 'Progress Bar',
    description: 'The feed with an overall progress bar and Stop.',
    recommended: false,
    image: '/directions/c-progress-bar.png',
  },
  {
    id: 'd',
    letter: 'D',
    title: 'Item Level Progress',
    description: 'The feed with every object listed, each with a small spinner. Hover a row to cancel it.',
    recommended: false,
    image: '/directions/d-item-level-progress.png',
  },
];

/** Where every direction starts: the Users list with every AD user ticked, so Move is one click away (Entra users can't be moved). */
export const JOBS_START_ROUTE = `#/users?select=${MOCK_USERS.filter((u) => !isEntraLocation(u.location))
  .map((u) => u.id)
  .join(',')}`;

const KEY = 'ars-jobs-direction';
const listeners = new Set<() => void>();

function read(): JobsDirection {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (JOBS_DIRECTIONS.some((d) => d.id === stored)) return stored as JobsDirection;
  } catch {
    // Storage can be blocked (private mode, embedded webviews); fall back to the MVP.
  }
  return 'b2';
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
  b1: { hourglass: true, popover: true, feed: false, bar: false, items: false, stateToasts: true },
  b2: { hourglass: true, popover: false, feed: true, bar: false, items: false, stateToasts: false },
  c: { hourglass: true, popover: false, feed: true, bar: true, items: false, stateToasts: false },
  d: { hourglass: true, popover: false, feed: true, bar: true, items: true, stateToasts: false },
};
