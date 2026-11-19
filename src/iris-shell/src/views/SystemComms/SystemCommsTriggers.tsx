import { Button } from '../../components/Button/Button.js';
import { setJobsView, startJob, useJobsState } from '../../lib/jobsStore.js';
import { addNotification, pushAlert } from '../../lib/notificationsStore.js';
import { showToast } from '../../lib/toastStore.js';
import styles from './SystemCommsTriggers.module.css';

interface Trigger {
  label: string;
  hint: string;
  run: () => void;
}

const FROM = 'O1D.local\\Users';
const TO = 'O1D.local\\Test OU\\Test1';

/** Prototype-only buttons that fire each system communication pattern: toast, Background Job (four kinds), notification, alert, and the Jobs UI switch (panel or menu). */
const TRIGGERS: Trigger[] = [
  { label: 'Toast', hint: 'Instant action: transient, auto-dismisses', run: () => showToast('Settings saved') },
  {
    label: 'Job',
    hint: 'Heavy work that succeeds: 102 items, can be cancelled',
    run: () => startJob({ title: 'Moving users', total: 102, from: FROM, to: TO, viewHref: '#/tree/o1d-test-ou-test1' }),
  },
  {
    label: 'Job fails',
    hint: 'Fails at item 18 and keeps a Retry state',
    run: () => startJob({ title: 'Moving users', total: 40, from: FROM, to: TO, failAt: 17 }),
  },
  {
    label: 'Entra job',
    hint: 'REST to Entra: no way to cancel',
    run: () => startJob({ title: 'Moving users', total: 60, from: 'Entra', to: 'Entra2', cancellable: false, stepMs: 120 }),
  },
  {
    label: 'Slow job',
    hint: 'Runs 30 seconds: escalates to a notification when done',
    run: () => startJob({ title: 'Moving users', total: 100, from: FROM, to: TO, stepMs: 300 }),
  },
  {
    label: 'Notification',
    hint: 'External trigger: lands in the bell until read',
    run: () => addNotification({ kind: 'mention', title: '@Sarah mentioned you', body: 'Can you review the Finance Team changes?' }),
  },
  {
    label: 'Alert',
    hint: 'Must-not-miss: inbox entry, push toast and email',
    run: () => pushAlert('Service account locked out', 'svc-backup was locked after 5 failed sign-ins.'),
  },
];

export function SystemCommsTriggers() {
  const { view } = useJobsState();
  return (
    <div className={styles.bar} role="group" aria-label="Prototype triggers for system communications">
      <span className={styles.label}>Trigger</span>
      {TRIGGERS.map((t) => (
        <Button key={t.label} variant="ghost" size="s" title={t.hint} onClick={t.run}>
          {t.label}
        </Button>
      ))}
      <span className={styles.label}>Jobs UI</span>
      <Button
        variant="secondary"
        size="s"
        title="Switch between the Dropbox-style panel and the Hourglass menu"
        onClick={() => setJobsView(view === 'panel' ? 'menu' : 'panel')}
      >
        {view === 'panel' ? 'Panel' : 'Menu'}
      </Button>
    </div>
  );
}
