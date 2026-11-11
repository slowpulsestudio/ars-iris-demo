import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { Badge, type BadgeTone } from '../../components/Badge/Badge.js';
import { BarChart } from '../../components/BarChart/BarChart.js';
import { Button } from '../../components/Button/Button.js';
import { Card } from '../../components/Card/Card.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { DonutChart } from '../../components/DonutChart/DonutChart.js';
import { LineChart } from '../../components/LineChart/LineChart.js';
import { ResourceIcon } from '../../components/ResourceIcon/ResourceIcon.js';
import { PageHeader, StatusCount } from './parts.js';
import { ACCESS_RECORDS, APPROVAL_REQUESTS, type ApprovalRequest } from './userViewData.js';
import styles from './UserView.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
// Read off the Figma charts' axes; Figma has no data behind them.
const APPROVALS_BY_MONTH = [37, 52, 28, 60, 42, 22];
const RESPONSE_HOURS = [21, 32, 27, 39, 34, 43];
const DATES = ['2026-05-14', '2026-05-13', '2026-05-12'];

const pending = APPROVAL_REQUESTS.filter((r) => r.status === 'Pending');
const accessCount = (status: string) => ACCESS_RECORDS.filter((a) => a.status === status).length;

const QUICK: Array<{ title: string; badge: string; tone: BadgeTone; icon: string; text: string; href: string }> = [
  { title: 'User Profile', badge: 'Active', tone: 'success', icon: 'User', text: 'View or change your personal account information', href: '#/user-view/profile' },
  { title: 'Approvals', badge: `${pending.length} Pending`, tone: 'warning', icon: 'CheckCircle', text: 'Work with approval tasks at this time', href: '#/user-view/approvals' },
  { title: 'My Managed Resources', badge: '4 Objects', tone: 'info', icon: 'FolderUser', text: 'View objects managed by self-service user', href: '#/user-view/my-access' },
  { title: 'My Access', badge: '20 Total', tone: 'neutral', icon: 'Key', text: 'View your access requests and access', href: '#/user-view/my-access' },
];

const COLUMNS: DataTableColumn<ApprovalRequest>[] = [
  { key: 'id', header: 'REQ ID', width: 90, cell: (r) => r.id },
  { key: 'requester', header: 'Requester', grow: 1, minWidth: 120, cell: (r) => r.requester.name },
  { key: 'resource', header: 'Resource', grow: 1, minWidth: 140, cell: (r) => r.object },
  { key: 'date', header: 'Date', width: 110, cell: (_r, i) => DATES[i] ?? '' },
];

const SUMMARY = [
  { status: 'Active', label: 'Active Access' },
  { status: 'Pending', label: 'Pending Approval' },
  { status: 'Inactive', label: 'Inactive' },
  { status: 'Revoked', label: 'Revoked' },
];

/** UserViewHome — the self-service home dashboard (home-dashboard, ARS_WebUI2_User-View-Approvals 10199:6772). */
export function UserViewHome() {
  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Home' }]} activeGlobalItem="#/user-view/home">
      <div className={styles.page}>
        <PageHeader title="Welcome to Active Roles" subtitle="Quick access to your most used features" />

        <div className={styles.cards}>
          {QUICK.map((q) => (
            <button key={q.title} type="button" className={styles.quick} onClick={() => navigate(q.href)}>
              <span className={styles.quickTop}>
                <ResourceIcon icon={q.icon} />
                <Badge tone={q.tone}>{q.badge}</Badge>
              </span>
              <span className={styles.quickTitle}>{q.title}</span>
              <span className={styles.quickText}>{q.text}</span>
            </button>
          ))}
        </div>

        <div className={styles.charts}>
          <Card title="Approvals by Month" helper="Last 6 months">
            <BarChart data={MONTHS.map((label, i) => ({ label, value: APPROVALS_BY_MONTH[i] }))} />
          </Card>
          <Card title="Approval Distribution" helper="Current period">
            <DonutChart
              segments={[
                { label: 'Approved', value: 75 },
                { label: 'Rejected', value: 15 },
                { label: 'Pending', value: 10 },
              ]}
            />
          </Card>
          <Card title="Response Time" helper="Avg. hours to approve (last 6 months)">
            <LineChart unit="h" data={MONTHS.map((label, i) => ({ label, value: RESPONSE_HOURS[i] }))} />
          </Card>
        </div>

        <div className={styles.split}>
          <Card title="Pending Approvals" actions={<Badge tone="warning">{`${pending.length} Pending`}</Badge>}>
            <div className={styles.panel}>
              <DataTable ariaLabel="Pending approvals" columns={COLUMNS} rows={pending.slice(0, 3)} hideRowActions />
              <Button variant="secondary" size="s" onClick={() => navigate('#/user-view/approvals')}>
                View All Approvals
              </Button>
            </div>
          </Card>

          <Card title="Access Summary">
            <div className={styles.panel}>
              <div className={styles.summaryGrid}>
                {SUMMARY.map((s) => (
                  <StatusCount key={s.status} status={s.status} label={s.label} value={accessCount(s.status)} />
                ))}
              </div>
              <Button variant="secondary" size="s" onClick={() => navigate('#/user-view/my-access')}>
                View All Access Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
