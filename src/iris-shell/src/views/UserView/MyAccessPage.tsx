import { useMemo, useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { showToast } from '../../lib/toastStore.js';
import { setHashParams, slug, useHashParam } from '../../lib/hashState.js';
import { Button } from '../../components/Button/Button.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { Tabs } from '../../components/Tabs/Tabs.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { Toggle } from '../../components/Toggle/Toggle.js';
import { PageHeader, PersonCard, SelectField, StatusBadge, StatusCount } from './parts.js';
import { ACCESS_DURATIONS, ACCESS_RECORDS, AVAILABLE_OBJECTS, type AccessRecord } from './userViewData.js';
import styles from './UserView.module.css';

const PAGE_SIZE = 10;
const REASON_LIMIT = 100;
const TABS = ['All Access', 'Active', 'Pending', 'Inactive', 'Revoked'];
const OBJECT_TYPES = [...new Set(AVAILABLE_OBJECTS.map((o) => o.type))];

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
  // The tab and the Request Access sheet live in the address (?tab=pending&sheet=request-access).
  const [tabParam] = useHashParam('tab');
  const tab = TABS.find((t) => slug(t) === tabParam) ?? TABS[0];
  const setTab = (next: string) => setHashParams({ tab: next === TABS[0] ? null : slug(next) });
  const [page, setPage] = useState(1);
  const [sheetParam] = useHashParam('sheet');
  const requestOpen = sheetParam === 'request-access';
  const setRequestOpen = (open: boolean) => setHashParams({ sheet: open ? 'request-access' : null });
  const [objectType, setObjectType] = useState('');
  const [object, setObject] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('Permanent');
  const [reason, setReason] = useState('');

  const count = (status: string) => records.filter((r) => r.status === status).length;
  const shown = useMemo(() => (tab === TABS[0] ? records : records.filter((r) => r.status === tab)), [records, tab]);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const objects = AVAILABLE_OBJECTS.filter((o) => !objectType || o.type === objectType);
  const chosen = AVAILABLE_OBJECTS.find((o) => o.name === object);

  const openRequest = () => {
    setObjectType('');
    setObject('');
    setDescription('');
    setDuration('Permanent');
    setReason('');
    setRequestOpen(true);
  };

  const chooseObject = (name: string) => {
    const next = AVAILABLE_OBJECTS.find((o) => o.name === name);
    setObject(name);
    if (next) {
      setObjectType(next.type);
      setDescription(next.description);
    }
  };

  const chooseType = (type: string) => {
    setObjectType(type);
    if (chosen && chosen.type !== type) {
      setObject('');
      setDescription('');
    }
  };

  const submit = () => {
    if (!chosen) return;
    setRecords((prev) => [
      {
        id: `a-new-${prev.length + 1}`,
        name: chosen.name,
        type: chosen.type,
        status: 'Pending',
        about: description.trim() || chosen.description,
        remaining: duration === 'Permanent' ? 'Long term' : duration,
        autoExtend: false,
      },
      ...prev,
    ]);
    setRequestOpen(false);
    showToast('Access request submitted', { supportingText: `${chosen.name} is awaiting approval by ${chosen.owner.name}.` });
  };

  const columns: DataTableColumn<AccessRecord>[] = [
    { key: 'name', header: 'Object Name', grow: 1, minWidth: 180, cell: (r) => r.name },
    { key: 'type', header: 'Object Type', width: 120, cell: (r) => r.type },
    { key: 'status', header: 'Status', width: 110, cell: (r) => <StatusBadge status={r.status} /> },
    { key: 'about', header: 'About', grow: 2, minWidth: 240, cell: (r) => r.about },
    { key: 'remaining', header: 'Time Remaining', width: 140, cell: (r) => r.remaining },
    {
      key: 'auto',
      header: 'Auto Extend',
      width: 110,
      cell: (r) => (
        <Toggle
          ariaLabel={`Auto extend ${r.name}`}
          checked={r.autoExtend}
          disabled={r.status === 'Revoked' || r.status === 'Inactive'}
          onChange={(on) => setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, autoExtend: on } : x)))}
        />
      ),
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'My Access' }]} activeGlobalItem="#/user-view/my-access">
      <div className={styles.page}>
        <PageHeader
          title="My Access"
          subtitle="Manage your time-based access requests and permissions"
          actions={
            <>
              <Button variant="secondary" onClick={() => downloadCsv(shown)}>
                Export
              </Button>
              <Button onClick={openRequest}>Request Access</Button>
            </>
          }
        />

        <div className={styles.cards}>
          {STATS.map((s) => (
            <StatusCount key={s.status} status={s.status} label={s.label} value={count(s.status)} text={s.text} />
          ))}
        </div>

        <section className={styles.records} aria-labelledby="access-records-title">
          <h2 id="access-records-title" className={styles.sectionTitle}>
            Access Records
          </h2>
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
            hideRowActions
            emptyState={{ title: 'No access records', description: 'Nothing matches this filter.' }}
          />
        </section>
        <div className={styles.pagination}>
          <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
        </div>
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
            options={objects.map((o) => o.name)}
            onChange={chooseObject}
            placeholder={`${objects.length} Available objects`}
          />
          <SelectField
            label="Object Type"
            required
            value={objectType}
            options={OBJECT_TYPES}
            onChange={chooseType}
            placeholder="Select a type"
          />
          <FormField label="Description">
            <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          {chosen && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Owner</span>
              <PersonCard person={chosen.owner} role="Owner" />
            </div>
          )}
          <SelectField label="Access Duration" required value={duration} options={ACCESS_DURATIONS} onChange={setDuration} />
          <FormField label="Reason for Request" required count={`${reason.length}/${REASON_LIMIT}`}>
            <Textarea
              value={reason}
              maxLength={REASON_LIMIT}
              placeholder="Please describe why you need access to this resource..."
              onChange={(e) => setReason(e.target.value)}
            />
          </FormField>
        </div>
      </SideSheet>
    </AppShell>
  );
}
