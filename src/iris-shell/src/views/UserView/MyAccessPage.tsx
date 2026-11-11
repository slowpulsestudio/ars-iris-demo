import { useMemo, useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { showToast } from '../../lib/toastStore.js';
import { Button } from '../../components/Button/Button.js';
import { ContentHeader } from '../../components/ContentHeader/ContentHeader.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { Tabs } from '../../components/Tabs/Tabs.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { Toggle } from '../../components/Toggle/Toggle.js';
import { PersonCard, SelectField, StatusBadge } from './parts.js';
import { ACCESS_DURATIONS, ACCESS_RECORDS, AVAILABLE_OBJECTS, type AccessRecord } from './userViewData.js';
import styles from './UserView.module.css';

const PAGE_SIZE = 10;
const REASON_LIMIT = 100;
const TABS = ['All Access', 'Active', 'Pending', 'Inactive', 'Revoked'];

const STATS = [
  { status: 'Active', label: 'Active Access', text: 'Current permissions' },
  { status: 'Pending', label: 'Pending Approval', text: 'Awaiting review' },
  { status: 'Inactive', label: 'Inactive', text: 'Expired access' },
  { status: 'Revoked', label: 'Revoked', text: 'Access withdrawn' },
];

function downloadCsv(records: AccessRecord[]): void {
  const lines = [
    ['Object Name', 'Object Type', 'Status', 'About', 'Time Remaining', 'Auto Extend'],
    ...records.map((r) => [r.name, r.type, r.status, r.about, r.remaining, r.autoExtend ? 'Yes' : 'No']),
  ].map((cols) => cols.map((c) => `"${c.replace(/"/g, '""')}"`).join(','));
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'access-records.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** MyAccessPage — time-based access records and the Request Access side sheet (my-access-screen-full 10199:6654, my-access-request-sidesheet 10199:7056). */
export function MyAccessPage() {
  const [records, setRecords] = useState<AccessRecord[]>(ACCESS_RECORDS);
  const [tab, setTab] = useState(TABS[0]);
  const [page, setPage] = useState(1);
  const [requestOpen, setRequestOpen] = useState(false);
  const [object, setObject] = useState('');
  const [duration, setDuration] = useState(ACCESS_DURATIONS[0]);
  const [reason, setReason] = useState('');

  const count = (status: string) => records.filter((r) => r.status === status).length;
  const shown = useMemo(() => (tab === TABS[0] ? records : records.filter((r) => r.status === tab)), [records, tab]);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const chosen = AVAILABLE_OBJECTS.find((o) => o.name === object);

  const openRequest = () => {
    setObject('');
    setDuration(ACCESS_DURATIONS[0]);
    setReason('');
    setRequestOpen(true);
  };

  const submit = () => {
    if (!chosen) return;
    setRecords((prev) => [
      {
        id: `a-new-${prev.length + 1}`,
        name: chosen.name,
        type: chosen.type,
        status: 'Pending',
        about: chosen.description,
        remaining: duration,
        autoExtend: false,
      },
      ...prev,
    ]);
    setRequestOpen(false);
    showToast('Access request submitted', { supportingText: `${chosen.name} is awaiting approval by ${chosen.owner.name}.` });
  };

  const columns: DataTableColumn<AccessRecord>[] = [
    { key: 'name', header: 'Object Name', grow: 1, minWidth: 200, cell: (r) => r.name },
    { key: 'type', header: 'Object Type', width: 120, cell: (r) => r.type },
    { key: 'status', header: 'Status', width: 120, cell: (r) => <StatusBadge status={r.status} /> },
    { key: 'about', header: 'About', grow: 2, minWidth: 240, cell: (r) => r.about },
    { key: 'remaining', header: 'Time Remaining', width: 150, cell: (r) => r.remaining },
    {
      key: 'auto',
      header: 'Auto Extend',
      width: 120,
      cell: (r) =>
        r.status === 'Active' ? (
          <Toggle
            ariaLabel={`Auto extend ${r.name}`}
            checked={r.autoExtend}
            onChange={(on) => setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, autoExtend: on } : x)))}
          />
        ) : null,
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'My Access' }]} activeGlobalItem="#/user-view/my-access">
      <ContentHeader
        icon="Key"
        title="My Access"
        subtitle="Manage your time-based access requests and permissions"
        actions={
          <>
            <Button variant="secondary" iconLead="Export" onClick={() => downloadCsv(shown)}>
              Export
            </Button>
            <Button iconLead="Plus" onClick={openRequest}>
              Request Access
            </Button>
          </>
        }
      />
      <div className={styles.page}>
        <div className={styles.cards}>
          {STATS.map((s) => (
            <div key={s.status} className={styles.stat}>
              <span className={styles.quickTitle}>{s.label}</span>
              <span className={styles.quickValue}>{count(s.status)}</span>
              <span className={styles.quickText}>{s.text}</span>
            </div>
          ))}
        </div>

        <Tabs
          ariaLabel="Access records"
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(1);
          }}
          items={TABS.map((t) => ({ value: t, label: `${t} (${t === TABS[0] ? records.length : count(t)})` }))}
        />
        <DataTable
          ariaLabel="Access records"
          columns={columns}
          rows={shown.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)}
          emptyState={{ title: 'No access records', description: 'Nothing matches this filter.' }}
        />
        <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
      </div>

      <SideSheet
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request Access"
        subtitle="Browse resources and enter details below to request temporary or permanent access permissions."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!chosen || !reason.trim()} onClick={submit}>
              Submit Request
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <SelectField
            label="Requested Object"
            required
            value={object}
            options={AVAILABLE_OBJECTS.map((o) => o.name)}
            onChange={setObject}
            placeholder="Select an object"
            helper={`${AVAILABLE_OBJECTS.length} Available objects`}
          />
          <FormField label="Description">
            <p className={styles.message}>{chosen?.description ?? '-'}</p>
          </FormField>
          <FormField label="Owner">{chosen ? <PersonCard person={chosen.owner} role="Owner" /> : <p className={styles.message}>-</p>}</FormField>
          <SelectField label="Access Duration" value={duration} options={ACCESS_DURATIONS} onChange={setDuration} />
          <FormField label="Reason for Request" required>
            <Textarea
              value={reason}
              maxLength={REASON_LIMIT}
              placeholder="Please describe why you need access to this resource..."
              onChange={(e) => setReason(e.target.value)}
            />
            <span className={styles.counter}>
              {reason.length}/{REASON_LIMIT}
            </span>
          </FormField>
        </div>
      </SideSheet>
    </AppShell>
  );
}
