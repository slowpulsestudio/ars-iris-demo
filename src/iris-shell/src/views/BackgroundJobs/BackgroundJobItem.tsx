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

function ItemRow({ job, item, index }: { job: Job; item: JobItem; index: number }) {
  const active = item.status === 'queued' || item.status === 'running';
  const label = { queued: 'Waiting', running: 'Moving', done: 'Moved', failed: 'Failed', cancelled: 'Cancelled' }[item.status];
  return (
    <li className={cx(styles.itemRow, styles[`item_${item.status}`])}>
      <span className={styles.itemName} title={item.name}>
        {item.name}
      </span>
      <span
        className={styles.itemTrack}
        role="progressbar"
        aria-label={`${item.name}: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(item.progress * 100)}
      >
        <span className={styles.itemFill} style={{ width: `${item.progress * 100}%` }} />
      </span>
      <span className={styles.itemStatus}>{label}</span>
      {active && job.status === 'running' ? (
        <IconButton icon="X" ariaLabel={`Cancel ${item.name}`} size="s" onClick={() => cancelJobItem(job.id, index)} />
      ) : (
        <span className={styles.itemSpacer} aria-hidden="true" />
      )}
    </li>
  );
}

/**
 * One Background Job, as much of it as the chosen direction shows: the count and a spinner ("24/100 completed")
 * from A2 and B, an overall progress bar and Stop from C, and every object with its own bar and Cancel in D. An Entra
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
        <span className={styles.icon}>
          {running ? <Spinner size="s" label="Running" /> : <Icon name={DONE_ICON[job.status]} size="16px" aria-hidden />}
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.route}>
            {job.from} <span aria-hidden="true">→</span> {job.to}
          </p>
          <p className={styles.status} aria-live="polite">
            {statusText(job)}
          </p>
        </div>
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
