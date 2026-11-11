import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { BarChart } from '../../components/BarChart/BarChart.js';
import { Button } from '../../components/Button/Button.js';
import { Card } from '../../components/Card/Card.js';
import { ContentHeader } from '../../components/ContentHeader/ContentHeader.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { DonutChart } from '../../components/DonutChart/DonutChart.js';
import { ACCESS_RECORDS, APPROVAL_REQUESTS } from './userViewData.js';
import styles from './UserView.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const APPROVALS_BY_MONTH = [22, 35, 28, 41, 50, 38];
const RESPONSE_HOURS = [36, 28, 32, 24, 30, 22];
const DATES = ['2026-05-14', '2026-05-13', '2026-05-12'];

const pending = APPROVAL_REQUESTS.filter((r) => r.status === 'Pending');
const accessCount = (status: string) => ACCESS_RECORDS.filter((a) => a.status === status).length;

interface PendingRow {
  id: string;
  requester: string;
  resource: string;
  date: string;
}

const COLUMNS: DataTableColumn<PendingRow>[] = [
  { key: 'id', header: 'REQ ID', width: 100, cell: (r) => r.id },
  { key: 'requester', header: 'Requester', grow: 1, minWidth: 140, cell: (r) => r.requester },
  { key: 'resource', header: 'Resource', grow: 1, minWidth: 160, cell: (r) => r.resource },
  { key: 'date', header: 'Date', width: 120, cell: (r) => r.date },
];

const QUICK = [
  { title: 'User Profile', value: 'Active', text: 'View or change your personal account information', href: '#/user-view/profile' },
  { title: 'Approvals', value: `${pending.length} Pending`, text: 'Work with approval tasks at this time', href: '#/user-view/approvals' },
  { title: 'My Managed Resources', value: '4 Objects', text: 'View objects managed by self-service user', href: '#/user-view/my-access' },
  { title: 'My Access', value: '20 Total', text: 'View your access requests and access', href: '#/user-view/my-access' },
];

/** UserViewHome — the self-service home dashboard (home-dashboard, ARS_WebUI2_User-View-Approvals 10199:6772). */
export function UserViewHome() {
  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Home' }]} activeGlobalItem="#/user-view/home">
      <ContentHeader icon="House" title="Welcome to Active Roles" subtitle="Quick access to your most used features" />
      <div className={styles.page}>
        <div className={styles.cards}>
          {QUICK.map((q) => (
            <button key={q.title} type="button" className={styles.quick} onClick={() => navigate(q.href)}>
              <span className={styles.quickTitle}>{q.title}</span>
              <span className={styles.quickValue}>{q.value}</span>
              <span className={styles.quickText}>{q.text}</span>
            </button>
          ))}
        </div>

        <div className={styles.charts}>
          <Card title="Approvals by Month" helper="Last 6 months">
            <BarChart data={MONTHS.map((label, i) => ({ label, value: APPROVALS_BY_MONTH[i] }))} />
          </Card>
          <Card title="Approval Distribution" helper="Current period">
            <div className={styles.panelBody}>
              <DonutChart
                segments={[
                  { label: 'Approved', value: 75 },
                  { label: 'Rejected', value: 15 },
                  { label: 'Pending', value: 10 },
                ]}
              />
              <ul className={styles.legend}>
                <li>Approved 75%</li>
                <li>Rejected 15%</li>
                <li>Pending 10%</li>
              </ul>
            </div>
          </Card>
          <Card title="Response Time" helper="Avg. hours to approve (last 6 months)">
            <BarChart color="purple" data={MONTHS.map((label, i) => ({ label, value: RESPONSE_HOURS[i] }))} />
          </Card>
        </div>

        <Card
          title="Pending Approvals"
          actions={
            <Button variant="secondary" size="s" onClick={() => navigate('#/user-view/approvals')}>
              View All Approvals
            </Button>
          }
        >
          <DataTable
            ariaLabel="Pending approvals"
            columns={COLUMNS}
            rows={pending.slice(0, 3).map((r, i) => ({ id: r.id, requester: r.requester.name, resource: r.object, date: DATES[i] }))}
          />
        </Card>

        <Card
          title="Access Summary"
          actions={
            <Button variant="secondary" size="s" onClick={() => navigate('#/user-view/my-access')}>
              View All Access Logs
            </Button>
          }
        >
          <dl className={styles.summary}>
            <dt>Active Access</dt>
            <dd>{accessCount('Active')}</dd>
            <dt>Pending Approval</dt>
            <dd>{accessCount('Pending')}</dd>
            <dt>Inactive</dt>
            <dd>{accessCount('Inactive')}</dd>
            <dt>Revoked</dt>
            <dd>{accessCount('Revoked')}</dd>
          </dl>
        </Card>
      </div>
    </AppShell>
  );
}
