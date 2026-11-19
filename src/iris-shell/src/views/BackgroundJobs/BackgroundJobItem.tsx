import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { cx } from '../../lib/cx.js';
import { cancelJob, clearJob, retryJob, type Job } from '../../lib/jobsStore.js';
import { navigate } from '../../lib/router.js';
import styles from './BackgroundJobItem.module.css';

const STATUS_ICON = { done: 'CheckCircle', failed: 'WarningCircle', cancelled: 'Info', running: 'ArrowsClockwise' } as const;

/**
 * One Background Job: title, from → to, total progress with a percentage, "24/102 items moved", and what the
 * user can do with it (Cancel while running where the work can be stopped, Retry after a failure, View and Clear
 * when it is over). Shared by the panel and the menu views. Not in Figma yet (see Design update recommendations).
 */
export function BackgroundJobItem({ job }: { job: Job }) {
  const { status, done, total } = job;
  const percent = total === 0 ? 100 : Math.round((done / total) * 100);
  const title = status === 'failed' ? `${job.title} failed` : status === 'done' ? `${job.title} complete` : job.title;
  return (
    <div className={cx(styles.item, styles[`status_${status}`])} role="group" aria-label={job.title}>
      <div className={styles.head}>
        <span className={styles.icon} aria-hidden="true" data-spin={status === 'running' ? 'true' : undefined}>
          <Icon name={STATUS_ICON[status]} size="20px" />
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.route}>
            {job.from} <span aria-hidden="true">→</span> {job.to}
          </p>
        </div>
      </div>
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
      <div className={styles.foot}>
        <span className={styles.count} aria-live="polite">
          {status === 'cancelled' ? `Cancelled: ${done}/${total} items moved` : `${done}/${total} items moved`}
        </span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      {status === 'failed' && job.error && <p className={styles.error}>{job.error}</p>}
      <div className={styles.actions}>
        {status === 'running' && job.cancellable && (
          <Button variant="secondary" size="s" onClick={() => cancelJob(job.id)}>
            Cancel
          </Button>
        )}
        {status === 'running' && !job.cancellable && <span className={styles.note}>This can't be cancelled.</span>}
        {status === 'failed' && (
          <Button variant="secondary" size="s" onClick={() => retryJob(job.id)}>
            Retry
          </Button>
        )}
        {status === 'done' && job.viewHref && (
          <Button variant="secondary" size="s" onClick={() => navigate(job.viewHref ?? '')}>
            View
          </Button>
        )}
        {status !== 'running' && (
          <Button variant="ghost" size="s" onClick={() => clearJob(job.id)}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
