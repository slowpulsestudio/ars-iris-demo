import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { Menu } from '../../components/Menu/Menu.js';
import { JOBS_DIRECTIONS, JOBS_START_ROUTE, directionInfo, setJobsDirection, useJobsDirection } from '../../lib/jobsDirection.js';
import { resetJobs, startJob, type JobSpec } from '../../lib/jobsStore.js';
import { navigate } from '../../lib/router.js';
import { addNotification, pushAlert } from '../../lib/notificationsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { MOCK_USERS } from '../UsersPage/mockUsers.js';
import styles from './SystemCommsTriggers.module.css';

interface Trigger {
  label: string;
  hint: string;
  run: () => void;
}

const FROM = 'O1D.local\\Users';
const TO = 'O1D.local\\Test OU\\Test1';

/** `count` sample user names, repeating the list with a number when it runs out. */
function names(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const name = MOCK_USERS[i % MOCK_USERS.length].name;
    return i < MOCK_USERS.length ? name : `${name} ${Math.floor(i / MOCK_USERS.length) + 1}`;
  });
}

function move(count: number, extra: Partial<JobSpec> = {}): JobSpec {
  return { title: 'Moving users', noun: 'users', names: names(count), from: FROM, to: TO, toName: 'Test1', viewHref: '#/tree/o1d-test-ou-test1', ...extra };
}

/** Prototype-only buttons that fire each system communication pattern: toast, Background Job (four kinds), notification, alert. */
const TRIGGERS: Trigger[] = [
  { label: 'Toast', hint: 'Instant action: transient, auto-dismisses', run: () => showToast('Settings saved') },
  { label: 'Job', hint: 'AD move of 100 users that succeeds', run: () => startJob(move(100)) },
  { label: 'Job fails', hint: 'AD move of 40 users; user 18 fails', run: () => startJob(move(40, { failAt: 17 })) },
  {
    label: 'Entra job',
    hint: 'Entra: no count, can’t be stopped, fast',
    run: () => startJob(move(60, { from: 'Entra', to: 'Entra2', toName: 'Entra2', directory: 'entra', tickMs: 10, viewHref: undefined })),
  },
  { label: 'Slow job', hint: 'Runs about 30 seconds, then escalates to a notification', run: () => startJob(move(100, { tickMs: 75 })) },
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

/** Switching direction clears the jobs and goes back to the Users list with every AD user ticked, ready to Move. */
function pickDirection(id: (typeof JOBS_DIRECTIONS)[number]['id']) {
  resetJobs();
  setJobsDirection(id);
  navigate(JOBS_START_ROUTE);
}

export function SystemCommsTriggers() {
  const current = useJobsDirection();
  const info = directionInfo(current);
  return (
    <div className={styles.bar} role="group" aria-label="Prototype triggers for system communications">
      <Menu
        ariaLabel="Background Jobs direction"
        align="start"
        topAnchor={44}
        items={JOBS_DIRECTIONS.map((d) => ({
          kind: 'item' as const,
          label: `${d.letter}: ${d.title}`,
          selected: d.id === current,
          onSelect: () => pickDirection(d.id),
        }))}
        trigger={({ ref, onClick, expanded }) => (
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type="button"
            className={styles.direction}
            onClick={onClick}
            aria-haspopup="menu"
            aria-expanded={expanded}
            aria-label={`Background Jobs direction: ${info.letter}, ${info.title}`}
            title={info.description}
          >
            {info.letter}: {info.title}
            <Icon name="CaretDown" size="12px" />
          </button>
        )}
      />
      {TRIGGERS.map((t) => (
        <Button key={t.label} variant="ghost" size="s" title={t.hint} onClick={t.run}>
          {t.label}
        </Button>
      ))}
    </div>
  );
}
