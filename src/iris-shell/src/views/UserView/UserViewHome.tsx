import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { cx } from '../../lib/cx.js';
import { Badge, type BadgeTone } from '../../components/Badge/Badge.js';
import { BarChart } from '../../components/BarChart/BarChart.js';
import { Button } from '../../components/Button/Button.js';
import { Card } from '../../components/Card/Card.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { DonutChart } from '../../components/DonutChart/DonutChart.js';
import { Icon } from '../../components/Icon/Icon.js';
import { LineChart } from '../../components/LineChart/LineChart.js';
import { ChartCard, PageHeader, StatusCount } from './parts.js';
import { ACCESS_RECORDS, APPROVAL_REQUESTS, type ApprovalRequest } from './userViewData.js';
import styles from './UserView.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
// Read off the Figma charts' axes; Figma has no data behind them.
const APPROVALS_BY_MONTH = [37, 52, 28, 60, 42, 22];
const RESPONSE_HOURS = [21, 32, 27, 39, 34, 43];
const DATES = ['2026-05-14', '2026-05-13', '2026-05-12'];
// The chart area under the card header (Figma ChartArea 10199:6826 and its axis).
const CHART_HEIGHT = 150;

const pending = APPROVAL_REQUESTS.filter((r) => r.status === 'Pending');
const accessCount = (status: string) => ACCESS_RECORDS.filter((a) => a.status === status).length;

const QUICK: Array<{ title: string; badge: string; tone: BadgeTone; icon: string; tile: string; text: string; href: string }> = [
  { title: 'User Profile', badge: 'Active', tone: 'success', icon: 'User', tile: styles.tileBlue, text: 'View or change your personal account information', href: '#/user-view/profile' },
  { title: 'Approvals', badge: `${pending.length} Pending`, tone: 'warning', icon: 'CheckCircle', tile: styles.tileGreen, text: 'Work with approval tasks at this time', href: '#/user-view/approvals' },
  { title: 'My Managed Resources', badge: '4 Objects', tone: 'info', icon: 'FolderUser', tile: styles.tilePurple, text: 'View objects managed by self-service user', href: '#/user-view/my-access' },
  { title: 'My Access', badge: '20 Total', tone: 'neutral', icon: 'Key', tile: styles.tileOrange, text: 'View your access requests and access', href: '#/user-view/my-access' },
];

// Figma's Pending Approvals columns: 95, 130, fill and 105 (TableHeaderRow 10199:6925).
const COLUMNS: DataTableColumn<ApprovalRequest>[] = [
  { key: 'id', header: 'REQ ID', width: 95, cell: (r) => r.id },
  { key: 'requester', header: 'Requester', width: 130, cell: (r) => r.requester.name },
  { key: 'resource', header: 'Resource', grow: 1, minWidth: 140, cell: (r) => r.object },
  { key: 'date', header: 'Date', width: 105, cell: (_r, i) => DATES[i] ?? '' },
];

const SUMMARY = [
  { status: 'Active', label: 'Active Access' },
  { status: 'Pending', label: 'Pending Approval' },
  { status: 'Inactive', label: 'Inactive' },
  { status: 'Revoked', label: 'Revoked' },
];

// Figma's legend colours: approved green, rejected red, pending yellow (DonutChartCard 10199:6860).
const DISTRIBUTION = [
  { label: 'Approved', value: 75, color: 'var(--oi-base-color-success)' },
  { label: 'Rejected', value: 15, color: 'var(--oi-base-color-error)' },
  { label: 'Pending', value: 10, color: 'var(--oi-base-color-warning)' },
];

/** UserViewHome — the self-service home dashboard (home-dashboard, ARS_WebUI2_User-View-Approvals 10199:6772). */
export function UserViewHome() {
  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Home' }]} activeGlobalItem="#/user-view/home">
      <div className={cx(styles.page, styles.carded)}>
        <PageHeader title="Welcome to Active Roles" subtitle="Quick access to your most used features" />

        <div className={styles.cards}>
          {QUICK.map((q) => (
            <button key={q.title} type="button" className={cx(styles.quick, styles.quickCard)} onClick={() => navigate(q.href)}>
              <span className={styles.quickTop}>
                <span className={cx(styles.tile, q.tile)} aria-hidden="true">
                  <Icon name={q.icon} size="18px" />
                </span>
                <Badge tone={q.tone}>{q.badge}</Badge>
              </span>
              <span className={styles.quickTitle}>{q.title}</span>
              <span className={styles.quickText}>{q.text}</span>
            </button>
          ))}
        </div>

        <div className={cx(styles.charts, styles.chartsRow)}>
          <ChartCard icon="ChartBar" title="Approvals by Month" helper="Last 6 months">
            <BarChart height={CHART_HEIGHT} data={MONTHS.map((label, i) => ({ label, value: APPROVALS_BY_MONTH[i] }))} />
          </ChartCard>
          <ChartCard icon="CheckCircle" title="Approval Distribution" helper="Current period">
            <DonutChart
              size="s"
              segments={DISTRIBUTION}
              centerValue="100%"
              centerLabel=""
              formatLegend={(s, total) => `${s.label} ${Math.round((s.value / total) * 100)}%`}
            />
          </ChartCard>
          <ChartCard icon="ChartLine" title="Response Time" helper="Avg. hours to approve (last 6 months)">
            <LineChart
              height={CHART_HEIGHT}
              unit="h"
              yTicks={[12, 24, 36, 48]}
              data={MONTHS.map((label, i) => ({ label, value: RESPONSE_HOURS[i] }))}
            />
          </ChartCard>
        </div>

        <div className={styles.split}>
          <Card className={styles.homeCard}>
            <div className={styles.panel}>
              <div className={styles.homeHead}>
                <h2 className={styles.homeTitle}>Pending Approvals</h2>
                <Badge tone="warning">{`${pending.length} Pending`}</Badge>
              </div>
              <DataTable
                ariaLabel="Pending approvals"
                className={styles.columnsOnly}
                columns={COLUMNS}
                rows={pending.slice(0, 3)}
                hideRowActions
              />
              <Button variant="secondary" onClick={() => navigate('#/user-view/approvals')}>
                View All Approvals
              </Button>
            </div>
          </Card>

          <Card className={styles.homeCard}>
            <div className={styles.panel}>
              <h2 className={styles.homeTitle}>Access Summary</h2>
              <div className={styles.summaryGrid}>
                {SUMMARY.map((s) => (
                  <StatusCount key={s.status} compact status={s.status} label={s.label} value={accessCount(s.status)} />
                ))}
              </div>
              <Button variant="secondary" onClick={() => navigate('#/user-view/my-access')}>
                View All Access Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
