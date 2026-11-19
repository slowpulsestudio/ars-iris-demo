import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button/Button.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { DIRECTION_FEATURES, useJobsDirection } from '../../lib/jobsDirection.js';
import { clearFinishedJobs, setFeedOpen, useJobsState } from '../../lib/jobsStore.js';
import { useOutsideDismiss } from '../../lib/useOutsideDismiss.js';
import { BackgroundJobItem } from './BackgroundJobItem.js';
import { HourglassIcon } from './HourglassIcon.js';
import styles from './JobsHeaderButton.module.css';

/**
 * The Hourglass button in the top bar (Figma: Iris UI Explorations, App layout 2880:25705, Button 2880:26127).
 * The sand runs and the glass turns while a job is running; a red dot (2880:26097) shows while a job has failed.
 * In B1 it opens the jobs in a popover, like the notifications menu; in B2, C and D it shows or hides the feed.
 * Not shown in A, which is toasts only.
 */
export function JobsHeaderButton() {
  const f = DIRECTION_FEATURES[useJobsDirection()];
  const { jobs, feedOpen } = useJobsState();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const menuOpen = f.popover && open;
  useOutsideDismiss(menuOpen, [wrapRef, menuRef], closeMenu);

  if (!f.hourglass) return null;

  const running = jobs.filter((j) => j.status === 'running').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const label = `Background jobs${running > 0 ? `, ${running} running` : ''}${failed > 0 ? `, ${failed} failed` : ''}`;
  const anchor = menuOpen ? wrapRef.current?.getBoundingClientRect() : undefined;

  const onClick = () => {
    if (f.popover) setOpen((v) => !v);
    else setFeedOpen(!feedOpen);
  };

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <Tooltip label="Background jobs">
        <IconButton
          icon={<HourglassIcon running={running > 0} />}
          ariaLabel={label}
          aria-expanded={f.popover ? menuOpen : feedOpen && jobs.length > 0}
          onClick={onClick}
        />
      </Tooltip>
      {failed > 0 && <span className={styles.dot} aria-hidden="true" />}
      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            role="dialog"
            aria-label="Background jobs"
            style={anchor ? { right: Math.max(16, window.innerWidth - anchor.right - 8) } : undefined}
          >
            <div className={styles.head}>
              <h2 className={styles.title}>Background jobs</h2>
              <Button variant="ghost" size="s" onClick={clearFinishedJobs} disabled={jobs.every((j) => j.status === 'running')}>
                Clear finished
              </Button>
            </div>
            {jobs.length === 0 ? (
              <p className={styles.empty}>No background jobs.</p>
            ) : (
              <div className={styles.list}>
                {jobs.map((job) => (
                  <BackgroundJobItem key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </span>
  );
}
