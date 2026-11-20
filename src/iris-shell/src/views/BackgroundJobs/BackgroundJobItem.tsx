import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Spinner } from '../../components/Spinner/Spinner.js';
import { cx } from '../../lib/cx.js';
import { DIRECTION_FEATURES, useJobsDirection } from '../../lib/jobsDirection.js';
import { cancelJob, cancelJobItem, clearJob, processedCount, type Job, type JobItem } from '../../lib/jobsStore.js';
import { navigate } from '../../lib/router.js';
import styles from './BackgroundJobItem.module.css';

const DONE_ICON = { done: 'CheckCircle', failed: 'WarningCircle', cancelled: 'Info' } as const;

function statusText(job: Job): string {
  const entra = job.directory === 'entra';
  switch (job.status) {
    case 'running':
      return entra ? 'Changes submitted' : `${job.done}/${job.total} completed`;
    case 'done':
    {
      if (entra) return 'Changes applied';
      const skipped = job.items.filter((it) => it.status === 'cancelled').length;
      const extra = [job.failed > 0 && `${job.failed} failed`, skipped > 0 && `${skipped} cancelled`].filter(Boolean).join(', ');
      return `${job.done}/${job.total} completed${extra ? `, ${extra}` : ''}`;
    }
    case 'cancelled':
      return `Cancelled after ${job.done}/${job.total}`;
    case 'failed':
      return job.error ?? 'Failed';
  }
}

const ITEM_STATE = { queued: 'Waiting', running: 'Moving', done: 'Moved', failed: 'Failed', cancelled: 'Cancelled' } as const;

/**
 * One object in an item level job (D): its name, and at the far right a small spinner while it moves, a tick when
 * moved, a warning when it failed. Hovering or focusing a waiting or moving row swaps that for a Cancel button.
 */
function ItemRow({ job, item, index }: { job: Job; item: JobItem; index: number }) {
  const cancellable = job.status === 'running' && (item.status === 'queued' || item.status === 'running');
  return (
    <li className={cx(styles.itemRow, styles[`item_${item.status}`], cancellable && styles.itemCancellable)}>
      <span className={styles.itemName} title={item.name}>
        {item.name}
      </span>
      <span className={styles.srOnly}>{ITEM_STATE[item.status]}</span>
      <span className={styles.itemSlot}>
        <span className={styles.itemState} aria-hidden="true">
          {item.status === 'running' && <Spinner size="s" label={`Moving ${item.name}`} />}
          {item.status === 'done' && <Icon name="Check" size="16px" />}
          {item.status === 'failed' && <Icon name="WarningCircle" size="16px" />}
          {item.status === 'cancelled' && <Icon name="Minus" size="16px" />}
        </span>
        {cancellable && (
          <IconButton
            className={styles.itemCancel}
            icon="X"
            ariaLabel={`Cancel ${item.name}`}
            size="s"
            onClick={() => cancelJobItem(job.id, index)}
          />
        )}
      </span>
    </li>
  );
}

/**
 * One Background Job, as much of it as the chosen direction shows: the count and a spinner ("24/100 completed")
 * from B1 and B2, an overall progress bar and Stop from C, and every object in D, each with a small spinner and a
 * Cancel on hover (D has no spinner of its own beside the job, as the rows carry it). An Entra
 * job only says its changes were submitted, and can't be stopped. Not in Figma yet (see Design update recommendations).
 */
export function BackgroundJobItem({ job }: { job: Job }) {
  const f = DIRECTION_FEATURES[useJobsDirection()];
  const entra = job.directory === 'entra';
  const running = job.status === 'running';
  const percent = job.total === 0 ? 100 : Math.round((processedCount(job) / job.total) * 100);
  const title = job.status === 'failed' ? `${job.title} failed` : job.status === 'done' ? `${job.title} complete` : job.title;
  return (
    <div className={cx(styles.job, styles[`status_${job.status}`])} role="group" aria-label={job.title}>
      <div className={styles.head}>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.route}>
            {job.from} <span aria-hidden="true">→</span> {job.to}
          </p>
          <p className={styles.status} aria-live="polite">
            {statusText(job)}
          </p>
        </div>
        {/* The job's state sits at the far right, like each object's in D. */}
        {!(running && f.items) && (
          <span className={styles.icon}>
            {running ? <Spinner size="s" label="Running" /> : <Icon name={DONE_ICON[job.status]} size="16px" aria-hidden />}
          </span>
        )}
      </div>
      {f.bar && !entra && (
        <div className={styles.bar}>
          <div
            className={styles.track}
            role="progressbar"
            aria-label={`${job.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
          <span className={styles.percent}>{percent}%</span>
        </div>
      )}
      {f.items && !entra && (
        <ul className={styles.items} aria-label="Objects">
          {job.items.map((item, i) => (
            <ItemRow key={`${item.name}-${i}`} job={job} item={item} index={i} />
          ))}
        </ul>
      )}
      <div className={styles.actions}>
        {running && !entra && (
          <Button variant="secondary" size="s" onClick={() => cancelJob(job.id)}>
            {f.bar ? 'Stop' : 'Cancel'}
          </Button>
        )}
        {running && entra && <span className={styles.note}>Entra changes can't be stopped.</span>}
        {job.status === 'done' && job.viewHref && (
          <Button variant="secondary" size="s" onClick={() => navigate(job.viewHref ?? '')}>
            View
          </Button>
        )}
        {!running && (
          <Button variant="ghost" size="s" onClick={() => clearJob(job.id)}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
