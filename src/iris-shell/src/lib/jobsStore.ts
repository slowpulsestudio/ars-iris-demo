import { useSyncExternalStore } from 'react';
import { addNotification } from './notificationsStore.js';
import { showToast } from './toastStore.js';

/**
 * jobsStore — Background Jobs: user-started heavy work (seconds to minutes) that keeps running while the
 * user does something else. A job is shown as a card while it runs, can be cancelled (when the directory
 * allows it) or retried after a failure, and stays inspectable until cleared. Instant actions never
 * become jobs; they use a toast.
 *
 * Two ways to show them are being tried (`JobsView`): a Dropbox-style panel under the toast area, or a list
 * in a popover from the top bar's Hourglass button, like the notifications menu.
 *
 * The prototype simulates the work: `step(i)` runs for each item on a timer.
 */

export type JobsView = 'panel' | 'menu';

export type JobStatus = 'running' | 'done' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  title: string;
  from: string;
  to: string;
  total: number;
  done: number;
  status: JobStatus;
  /** False where the directory gives no way to stop the work, e.g. REST calls to Entra. */
  cancellable: boolean;
  error?: string;
  /** Where the done card's View button goes. */
  viewHref?: string;
  startedAt: number;
}

export interface JobSpec {
  title: string;
  from: string;
  to: string;
  total: number;
  cancellable?: boolean;
  /** Time per item. */
  stepMs?: number;
  /** Does the work for item `index`. */
  step?: (index: number) => void;
  /** Demo: the item that fails the first time round, so Retry can be seen. */
  failAt?: number;
  viewHref?: string;
}

/** A job that ran this long, or finished while its card was dismissed, escalates to a notification. */
export const JOB_ESCALATE_AFTER_MS = 20_000;
const DEFAULT_STEP_MS = 60;

interface Runner {
  spec: JobSpec;
  timer?: number;
}

export interface JobsState {
  jobs: Job[];
  view: JobsView;
  /** Panel view: whether the panel is showing. Closing it hides it until the Hourglass button reopens it. */
  panelOpen: boolean;
}

let state: JobsState = { jobs: [], view: 'panel', panelOpen: false };
const runners = new Map<string, Runner>();
const listeners = new Set<() => void>();
let nextId = 1;

function setState(changes: Partial<JobsState>) {
  state = { ...state, ...changes };
  for (const l of listeners) l();
}

function patch(id: string, changes: Partial<Job>) {
  setState({ jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...changes } : j)) });
}

/** In the panel view, a job that ends while the panel is closed has nobody watching it. */
function unwatched(): boolean {
  return state.view === 'panel' && !state.panelOpen;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function find(id: string): Job | undefined {
  return state.jobs.find((j) => j.id === id);
}

function stop(id: string) {
  const runner = runners.get(id);
  if (runner?.timer !== undefined) clearInterval(runner.timer);
  if (runner) runner.timer = undefined;
}

function finish(job: Job) {
  stop(job.id);
  const slow = Date.now() - job.startedAt >= JOB_ESCALATE_AFTER_MS;
  patch(job.id, { status: 'done' });
  if (unwatched() || slow) {
    addNotification({
      kind: 'job',
      title: `${job.title} finished`,
      body: `${job.total} of ${job.total} items, to ${job.to}.`,
      href: job.viewHref,
    });
  }
}

function fail(job: Job, error: string) {
  stop(job.id);
  patch(job.id, { status: 'failed', error });
  if (unwatched()) {
    addNotification({ kind: 'job', title: `${job.title} failed`, body: `${error} Open Background Jobs to retry.` });
  }
}

function tick(id: string) {
  const job = find(id);
  const runner = runners.get(id);
  if (!job || !runner || job.status !== 'running') return;
  if (job.done >= job.total) {
    finish(job);
    return;
  }
  const { spec } = runner;
  if (spec.failAt === job.done) {
    spec.failAt = undefined;
    fail(job, `Item ${job.done + 1} could not be processed.`);
    return;
  }
  try {
    spec.step?.(job.done);
  } catch {
    fail(job, `Item ${job.done + 1} could not be processed.`);
    return;
  }
  patch(id, { done: job.done + 1 });
}

function run(id: string) {
  const runner = runners.get(id);
  if (!runner) return;
  stop(id);
  runner.timer = window.setInterval(() => tick(id), runner.spec.stepMs ?? DEFAULT_STEP_MS);
}

/** Starts a job. The panel view opens its panel; the menu view tells the user with a toast, since nothing else shows. Returns its id. */
export function startJob(spec: JobSpec): string {
  const id = `job-${nextId++}`;
  runners.set(id, { spec: { ...spec } });
  setState({
    jobs: [
      ...state.jobs,
      {
        id,
        title: spec.title,
        from: spec.from,
        to: spec.to,
        total: spec.total,
        done: 0,
        status: 'running',
        cancellable: spec.cancellable ?? true,
        viewHref: spec.viewHref,
        startedAt: Date.now(),
      },
    ],
    panelOpen: state.view === 'panel' ? true : state.panelOpen,
  });
  if (state.view === 'menu') showToast(`${spec.title}: ${spec.total} items started. Track them under Background jobs.`);
  run(id);
  return id;
}

/** Stops the remaining items. What already moved stays moved. */
export function cancelJob(id: string): void {
  const job = find(id);
  if (!job || job.status !== 'running' || !job.cancellable) return;
  stop(id);
  patch(id, { status: 'cancelled' });
}

/** Carries on from the item that failed. */
export function retryJob(id: string): void {
  const job = find(id);
  if (!job || job.status !== 'failed') return;
  patch(id, { status: 'running', error: undefined });
  if (state.view === 'panel') setState({ panelOpen: true });
  run(id);
}

/** Removes a job that isn't running from the list. */
export function clearJob(id: string): void {
  const job = find(id);
  if (!job || job.status === 'running') return;
  runners.delete(id);
  setState({ jobs: state.jobs.filter((j) => j.id !== id) });
}

/** Removes every finished, failed or cancelled job. */
export function clearFinishedJobs(): void {
  for (const j of state.jobs) if (j.status !== 'running') runners.delete(j.id);
  setState({ jobs: state.jobs.filter((j) => j.status === 'running') });
}

export function setJobsPanelOpen(open: boolean): void {
  setState({ panelOpen: open });
}

export function setJobsView(view: JobsView): void {
  setState({ view, panelOpen: false });
}

export function useJobsState(): JobsState {
  return useSyncExternalStore(subscribe, () => state);
}
