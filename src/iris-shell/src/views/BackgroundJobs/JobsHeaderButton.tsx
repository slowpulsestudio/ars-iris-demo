import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button/Button.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { clearFinishedJobs, setJobsPanelOpen, useJobsState } from '../../lib/jobsStore.js';
import { useOutsideDismiss } from '../../lib/useOutsideDismiss.js';
import { BackgroundJobItem } from './BackgroundJobItem.js';
import styles from './JobsHeaderButton.module.css';

/**
 * The Hourglass button in the top bar (Figma: Iris UI Explorations, App layout 2880:25705, Button 2880:26127), with
 * its red dot (2880:26097) while a job is running or has failed. In the menu view it opens the jobs in a popover,
 * like the notifications menu; in the panel view it shows or hides the Dropbox-style panel.
 */
export function JobsHeaderButton() {
  const { jobs, view, panelOpen } = useJobsState();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const menuOpen = view === 'menu' && open;
  useOutsideDismiss(menuOpen, [wrapRef, menuRef], closeMenu);

  const running = jobs.filter((j) => j.status === 'running').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const label = `Background jobs${running > 0 ? `, ${running} running` : ''}${failed > 0 ? `, ${failed} failed` : ''}`;
  const anchor = menuOpen ? wrapRef.current?.getBoundingClientRect() : undefined;

  const onClick = () => {
    if (view === 'panel') setJobsPanelOpen(!panelOpen);
    else setOpen((v) => !v);
  };

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <Tooltip label="Background jobs">
        <IconButton icon="Hourglass" ariaLabel={label} aria-expanded={view === 'panel' ? panelOpen : menuOpen} onClick={onClick} />
      </Tooltip>
      {(running > 0 || failed > 0) && <span className={styles.dot} aria-hidden="true" />}
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
