import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { cx } from '../../lib/cx.js';
import { DIRECTION_FEATURES, useJobsDirection } from '../../lib/jobsDirection.js';
import { processedCount, setFeedMinimised, setFeedOpen, useJobsState, type Job } from '../../lib/jobsStore.js';
import { BackgroundJobItem, titleWithTotal } from './BackgroundJobItem.js';
import { HourglassIcon } from './HourglassIcon.js';
import styles from './BackgroundJobsFeed.module.css';

/** The toast sits above the feed: it reads the feed's height from this custom property (see Toast.module.css). */
const STACK_OFFSET = '--oi-toast-stack-offset';

function summary(jobs: Job[], count: boolean): { title: string; detail?: string } {
  const running = jobs.filter((j) => j.status === 'running');
  const failed = jobs.filter((j) => j.status === 'failed').length;
  if (running.length > 1) return { title: `${running.length} background jobs running`, detail: 'In progress' };
  if (running.length === 1) {
    const job = running[0];
    const detail = job.directory === 'entra' ? 'Changes submitted' : count ? `${job.done}/${job.total} completed` : undefined;
    return { title: count ? job.title : titleWithTotal(job), detail };
  }
  if (failed > 0) return { title: `${failed} background job${failed === 1 ? '' : 's'} failed`, detail: 'Open to see what happened' };
  return { title: 'Background jobs complete', detail: `${jobs.length} job${jobs.length === 1 ? '' : 's'}` };
}

/**
 * The progress feed (directions C, D and E): at the bottom right under the toast area, as wide as a toast, and the
 * toast moves up above it. The down caret folds it into just its title bar (with a thin overall bar under it in D and E); the X
 * closes it and the Hourglass in the top bar reopens it. It is part of the shell, so it follows the user across app
 * pages but not onto the welcome page.
 */
export function BackgroundJobsFeed() {
  const direction = useJobsDirection();
  const f = DIRECTION_FEATURES[direction];
  const { jobs, feedOpen, feedMinimised } = useJobsState();
  const ref = useRef<HTMLElement>(null);
  const showing = f.feed && feedOpen && jobs.length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!showing || !el) return;
    const root = document.documentElement;
    const gap = getComputedStyle(root).getPropertyValue('--oi-spacing-m').trim() || '12px';
    const update = () => root.style.setProperty(STACK_OFFSET, `calc(${el.offsetHeight}px + ${gap})`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty(STACK_OFFSET);
    };
  }, [showing]);

  if (!showing) return null;

  const running = jobs.some((j) => j.status === 'running');
  const { title, detail } = summary(jobs, f.count);
  const adJobs = jobs.filter((j) => j.directory === 'ad');
  const total = adJobs.reduce((n, j) => n + j.total, 0);
  const done = adJobs.reduce((n, j) => n + processedCount(j), 0);
  const percent = total === 0 ? 100 : Math.round((done / total) * 100);

  const bar = f.bar && total > 0 && (
    <div
      className={styles.total}
      role="progressbar"
      aria-label="Overall progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className={styles.totalFill} style={{ width: `${percent}%` }} />
    </div>
  );

  return createPortal(
    <section ref={ref} className={styles.feed} aria-label="Background jobs">
      <div className={styles.head}>
        <span className={styles.icon}>
          <HourglassIcon running={running} />
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          {detail && <p className={styles.detail}>{detail}</p>}
        </div>
        <IconButton
          icon={feedMinimised ? 'CaretUp' : 'CaretDown'}
          ariaLabel={feedMinimised ? 'Expand background jobs' : 'Minimise background jobs'}
          size="s"
          aria-expanded={!feedMinimised}
          onClick={() => setFeedMinimised(!feedMinimised)}
        />
        <IconButton icon="X" ariaLabel="Close background jobs" size="s" onClick={() => setFeedOpen(false)} />
      </div>
      {feedMinimised ? (
        bar
      ) : (
        <div className={styles.list}>
          {jobs.map((job) => (
            <BackgroundJobItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>,
    document.body,
  );
}
