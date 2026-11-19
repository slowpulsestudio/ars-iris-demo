import { useSyncExternalStore } from 'react';
import { DIRECTION_FEATURES, getJobsDirection } from './jobsDirection.js';
import { addNotification } from './notificationsStore.js';
import { showToast } from './toastStore.js';

/**
 * jobsStore — Background Jobs: user-started heavy work (seconds to minutes) that carries on while the user does
 * something else. Instant actions never become jobs; they use a toast.
 *
 * As the engineers recommend, a job works through its list in serial. AD reports how many objects are done; Entra
 * can't, so an Entra job only says its changes were submitted, and can't be stopped. How much of this the user
 * sees depends on the complexity direction picked on the welcome page (`jobsDirection.ts`).
 *
 * The prototype simulates the work: each object takes a few ticks, then `step(i)` does it.
 */

export type JobStatus = 'running' | 'done' | 'failed' | 'cancelled';
export type JobDirectory = 'ad' | 'entra';
export type JobItemStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled';

export interface JobItem {
  name: string;
  status: JobItemStatus;
  /** 0 to 1. */
  progress: number;
}

export interface Job {
  id: string;
  /** e.g. "Moving users". */
  title: string;
  /** Plural noun for the objects, e.g. "users". */
  noun: string;
  from: string;
  to: string;
  /** Short destination name for messages, e.g. "Test1". */
  toName: string;
  directory: JobDirectory;
  items: JobItem[];
  total: number;
  /** Objects done. */
  done: number;
  /** Objects that failed (only item level jobs carry on past a failure). */
  failed: number;
  status: JobStatus;
  error?: string;
  /** Where View goes once the job is complete. */
  viewHref?: string;
  startedAt: number;
}

/** Objects no longer waiting or moving: done, failed or cancelled. */
export function processedCount(job: Job): number {
  return job.items.filter((it) => it.status !== 'queued' && it.status !== 'running').length;
}

export interface JobSpec {
  title: string;
  noun: string;
  from: string;
  to: string;
  toName?: string;
  directory?: JobDirectory;
  /** One name per object. */
  names: string[];
  /** Time per tick; an object takes `TICKS_PER_ITEM` ticks. */
  tickMs?: number;
  /** Does the work for object `index`. */
  step?: (index: number) => void;
  /** Demo: the object that fails. */
  failAt?: number;
  viewHref?: string;
}

/** A job that ran this long, or ended while its feed was closed, escalates to a notification. */
export const JOB_ESCALATE_AFTER_MS = 20_000;
const TICKS_PER_ITEM = 4;
const DEFAULT_TICK_MS = 30;

export interface JobsState {
  jobs: Job[];
  /** Feed directions: whether the feed is showing. Closing it hides it until the Hourglass reopens it. */
  feedOpen: boolean;
  /** Feed directions: the feed is folded down to its header. */
  feedMinimised: boolean;
}

interface Runner {
  spec: JobSpec;
  timer?: number;
}

let state: JobsState = { jobs: [], feedOpen: false, feedMinimised: false };
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

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function find(id: string): Job | undefined {
  return state.jobs.find((j) => j.id === id);
}

function features() {
  return DIRECTION_FEATURES[getJobsDirection()];
}

function stop(id: string) {
  const runner = runners.get(id);
  if (runner?.timer !== undefined) clearInterval(runner.timer);
  if (runner) runner.timer = undefined;
}

function escalate(job: Job, title: string, body: string, href?: string) {
  const slow = Date.now() - job.startedAt >= JOB_ESCALATE_AFTER_MS;
  const unwatched = features().feed && !state.feedOpen;
  if (slow || unwatched) addNotification({ kind: 'job', title, body, href });
}

function countText(job: Job, n: number): string {
  return `${n} of ${job.total} ${job.noun}`;
}

function finish(job: Job) {
  stop(job.id);
  patch(job.id, { status: 'done' });
  const entra = job.directory === 'entra';
  const message = entra
    ? `Changes applied to ${job.total} ${job.noun}.`
    : job.failed > 0
      ? `Moved ${job.done} of ${job.total} ${job.noun} to ${job.toName}. ${job.failed} could not be moved.`
      : `Moved ${job.total} ${job.noun} to ${job.toName}.`;
  if (features().stateToasts) {
    showToast(message, { viewHref: job.viewHref, viewLabel: 'View', tone: job.failed > 0 ? 'warning' : 'success' });
  }
  escalate(job, `${job.title} complete`, message, job.viewHref);
}

function fail(job: Job) {
  stop(job.id);
  const error = `Stopped after ${countText(job, job.done)}. Some ${job.noun} could not be moved.`;
  patch(job.id, { status: 'failed', error });
  if (features().stateToasts) showToast(`${job.title} failed`, { tone: 'error', supportingText: error });
  escalate(job, `${job.title} failed`, error);
}

function setItem(job: Job, index: number, changes: Partial<JobItem>): JobItem[] {
  return job.items.map((it, i) => (i === index ? { ...it, ...changes } : it));
}

function tick(id: string) {
  const job = find(id);
  const runner = runners.get(id);
  if (!job || !runner || job.status !== 'running') return;
  const index = job.items.findIndex((it) => it.status === 'queued' || it.status === 'running');
  if (index === -1) {
    finish(job);
    return;
  }
  const item = job.items[index];
  const { spec } = runner;
  if (item.status === 'queued' && spec.failAt === index) {
    spec.failAt = undefined;
    // Item level progress tracks each object, so one failure doesn't stop the rest.
    if (features().items) {
      patch(id, { items: setItem(job, index, { status: 'failed' }), failed: job.failed + 1 });
    } else {
      patch(id, { items: setItem(job, index, { status: 'failed' }) });
      fail({ ...job });
    }
    return;
  }
  const progress = Math.min(1, item.progress + 1 / TICKS_PER_ITEM);
  if (progress < 1) {
    patch(id, { items: setItem(job, index, { status: 'running', progress }) });
    return;
  }
  spec.step?.(index);
  patch(id, { items: setItem(job, index, { status: 'done', progress: 1 }), done: job.done + 1 });
}

/** Starts a job. Returns its id. */
export function startJob(spec: JobSpec): string {
  const id = `job-${nextId++}`;
  runners.set(id, { spec: { ...spec } });
  const directory = spec.directory ?? 'ad';
  const job: Job = {
    id,
    title: spec.title,
    noun: spec.noun,
    from: spec.from,
    to: spec.to,
    toName: spec.toName ?? spec.to,
    directory,
    items: spec.names.map((name) => ({ name, status: 'queued', progress: 0 })),
    total: spec.names.length,
    done: 0,
    failed: 0,
    status: 'running',
    viewHref: spec.viewHref,
    startedAt: Date.now(),
  };
  const f = features();
  setState({ jobs: [...state.jobs, job], feedOpen: f.feed ? true : state.feedOpen });
  if (f.stateToasts) {
    showToast(directory === 'entra' ? `Changes submitted for ${job.total} ${job.noun}.` : `${job.title}: ${job.total} ${job.noun} to ${job.toName}.`, {
      tone: 'info',
      supportingText: f.popover ? 'Track it with Background jobs in the top bar.' : "You'll be told when it's done.",
    });
  }
  const runner = runners.get(id);
  if (runner) runner.timer = window.setInterval(() => tick(id), spec.tickMs ?? DEFAULT_TICK_MS);
  return id;
}

/** Stops the objects not yet done. Those already done stay done. Not possible for Entra. */
export function cancelJob(id: string): void {
  const job = find(id);
  if (!job || job.status !== 'running' || job.directory === 'entra') return;
  stop(id);
  const items = job.items.map((it) => (it.status === 'queued' || it.status === 'running' ? { ...it, status: 'cancelled' as const } : it));
  patch(id, { status: 'cancelled', items });
  if (features().stateToasts) showToast(`${job.title} cancelled`, { tone: 'info', supportingText: `Stopped after ${countText(job, job.done)}.` });
}

/** Item level (D): skips one object that hasn't been done yet. */
export function cancelJobItem(id: string, index: number): void {
  const job = find(id);
  const item = job?.items[index];
  if (!job || !item || job.status !== 'running' || (item.status !== 'queued' && item.status !== 'running')) return;
  patch(id, { items: setItem(job, index, { status: 'cancelled' }) });
}

/** Removes a job that isn't running. */
export function clearJob(id: string): void {
  const job = find(id);
  if (!job || job.status === 'running') return;
  runners.delete(id);
  setState({ jobs: state.jobs.filter((j) => j.id !== id) });
}

/** Removes every job that isn't running. */
export function clearFinishedJobs(): void {
  for (const j of state.jobs) if (j.status !== 'running') runners.delete(j.id);
  setState({ jobs: state.jobs.filter((j) => j.status === 'running') });
}

export function setFeedOpen(open: boolean): void {
  setState({ feedOpen: open });
}

export function setFeedMinimised(minimised: boolean): void {
  setState({ feedMinimised: minimised });
}

/** Stops and forgets every job, e.g. when another direction is picked on the welcome page. */
export function resetJobs(): void {
  for (const id of runners.keys()) stop(id);
  runners.clear();
  setState({ jobs: [], feedOpen: false, feedMinimised: false });
}

export function useJobsState(): JobsState {
  return useSyncExternalStore(subscribe, () => state);
}
