import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../components/Icon/Icon.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { setJobsPanelOpen, useJobsState } from '../../lib/jobsStore.js';
import { BackgroundJobItem } from './BackgroundJobItem.js';
import styles from './BackgroundJobsPanel.module.css';

/** The toast sits above this panel: it reads the panel's height from this custom property (see Toast.module.css). */
const STACK_OFFSET = '--oi-toast-stack-offset';

/**
 * Panel view of Background Jobs, in the style of Dropbox's upload panel: at the bottom right under the toast area,
 * as wide as a toast, and the toast moves up above it. The header summarises every job and collapses the list;
 * the X closes the panel, and the Hourglass button in the top bar reopens it.
 */
export function BackgroundJobsPanel() {
  const { jobs, panelOpen, view } = useJobsState();
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const showing = view === 'panel' && panelOpen && jobs.length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!showing || !el) return;
    const gap = getComputedStyle(document.documentElement).getPropertyValue('--oi-spacing-m').trim() || '12px';
    const update = () => document.documentElement.style.setProperty(STACK_OFFSET, `calc(${el.offsetHeight}px + ${gap})`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty(STACK_OFFSET);
    };
  }, [showing]);

  if (!showing) return null;

  const running = jobs.filter((j) => j.status === 'running');
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const total = jobs.reduce((sum, j) => sum + j.total, 0);
  const done = jobs.reduce((sum, j) => sum + j.done, 0);
  const percent = total === 0 ? 100 : Math.round((done / total) * 100);
  const title =
    running.length > 0
      ? running.length === 1
        ? running[0].title
        : `${running.length} background jobs running`
      : failed > 0
        ? `${failed} background job${failed === 1 ? '' : 's'} failed`
        : 'Background jobs complete';

  return createPortal(
    <section ref={ref} className={styles.panel} aria-label="Background jobs">
      <div className={styles.head}>
        <span className={styles.icon} aria-hidden="true">
          <Icon name="Hourglass" size="20px" />
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.summary}>
            {done}/{total} items · {percent}%
          </p>
        </div>
        <IconButton
          icon={collapsed ? 'CaretUp' : 'CaretDown'}
          ariaLabel={collapsed ? 'Show background jobs' : 'Minimise background jobs'}
          size="s"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
        />
        <IconButton icon="X" ariaLabel="Close background jobs" size="s" onClick={() => setJobsPanelOpen(false)} />
      </div>
      {collapsed ? (
        <div
          className={styles.total}
          role="progressbar"
          aria-label="Total progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={styles.totalFill} style={{ width: `${percent}%` }} />
        </div>
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
