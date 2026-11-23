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

function statusText(job: Job, count: boolean): string | null {
  const entra = job.directory === 'entra';
  switch (job.status) {
    case 'running':
      return entra ? 'Changes submitted' : count ? `${job.done}/${job.total} completed` : null;
    case 'done':
    {
      if (entra) return 'Changes applied';
      if (!count) return null;
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

/** "Moving users" as "Moving 100 users", for the directions that don't show a count. */
export function titleWithTotal(job: Job): string {
  return job.title.replace(job.noun, `${job.total} ${job.noun}`);
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
 * One Background Job, as much of it as the chosen direction shows: the total in the title and a spinner
 * ("Moving 100 users") in B and C, the count ("24/100 completed") and a spinner from D, an overall progress bar and Stop from D, and every object in E, each with a small spinner and a
 * Cancel on hover (E has no spinner of its own beside the job, as the rows carry it). An Entra
 * job only says its changes were submitted, and can't be stopped. Not in Figma yet (see Design update recommendations).
 */
export function BackgroundJobItem({ job }: { job: Job }) {
  const f = DIRECTION_FEATURES[useJobsDirection()];
  const entra = job.directory === 'entra';
  const running = job.status === 'running';
  const percent = job.total === 0 ? 100 : Math.round((processedCount(job) / job.total) * 100);
  const name = f.count ? job.title : titleWithTotal(job);
  const title = job.status === 'failed' ? `${name} failed` : job.status === 'done' ? `${name} complete` : name;
  const status = statusText(job, f.count);
  return (
    <div className={cx(styles.job, styles[`status_${job.status}`])} role="group" aria-label={job.title}>
      <div className={styles.head}>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.route}>
            {job.from} <span aria-hidden="true">→</span> {job.to}
          </p>
          {status && (
            <p className={styles.status} aria-live="polite">
              {status}
            </p>
          )}
        </div>
        {/* The job's state sits at the far right, like each object's in E. */}
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
            View in destination
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
