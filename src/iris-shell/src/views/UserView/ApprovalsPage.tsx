import { useMemo, useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { showToast } from '../../lib/toastStore.js';
import { Button } from '../../components/Button/Button.js';
import { ContentHeader } from '../../components/ContentHeader/ContentHeader.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Modal } from '../../components/Modal/Modal.js';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { Tabs } from '../../components/Tabs/Tabs.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { Detail, PersonCard, StatusBadge } from './parts.js';
import { APPROVAL_REQUESTS, type ApprovalRequest, type RequestStatus } from './userViewData.js';
import styles from './UserView.module.css';

const PAGE_SIZE = 10;
const TABS = ['All Requests', 'Pending', 'Previous'];
type Action = 'approve' | 'deny' | 'escalate';

/** ApprovalsPage — approval requests with Approve, Deny and Escalate (approvals-screen 10199:6730 and its modals and sheets). */
export function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(APPROVAL_REQUESTS);
  const [tab, setTab] = useState(TABS[0]);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [comment, setComment] = useState('');
  const [escalateTo, setEscalateTo] = useState('');
  const [subject, setSubject] = useState('');

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const shown = useMemo(
    () =>
      tab === 'Pending'
        ? requests.filter((r) => r.status === 'Pending')
        : tab === 'Previous'
          ? requests.filter((r) => r.status !== 'Pending')
          : requests,
    [requests, tab],
  );
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const open = requests.find((r) => r.id === openId) ?? null;

  const startAction = (next: Action) => {
    setComment('');
    setEscalateTo('');
    setSubject(`Escalation: ${open?.id ?? ''}`);
    setAction(next);
  };

  const decide = (status: RequestStatus) => {
    if (!open) return;
    const decidedOn = `${new Date().toISOString().slice(0, 10)} at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === open.id ? { ...r, status, decidedOn, ...(status === 'Denied' && { denialReason: comment.trim() }) } : r,
      ),
    );
    setAction(null);
    setOpenId(null);
    showToast(status === 'Approved' ? 'Request approved' : 'Request denied', { supportingText: `${open.id} · ${open.object}` });
  };

  const escalate = () => {
    if (!open) return;
    setAction(null);
    showToast('Escalation sent', { supportingText: `${open.id} was sent to ${escalateTo.trim()}.` });
  };

  const columns: DataTableColumn<ApprovalRequest>[] = [
    { key: 'id', header: 'REQ ID', width: 110, cell: (r) => r.id },
    { key: 'requester', header: 'Requester', grow: 1, minWidth: 160, cell: (r) => r.requester.name },
    { key: 'object', header: 'Requested Object', grow: 1, minWidth: 180, cell: (r) => r.object },
    { key: 'duration', header: 'Access Duration', width: 140, cell: (r) => r.duration },
    { key: 'status', header: 'Status', width: 120, cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'action',
      header: '',
      width: 110,
      cell: (r) => (
        <Button variant="ghost" size="s" onClick={() => setOpenId(r.id)}>
          {r.status === 'Pending' ? 'Review' : 'View'}
        </Button>
      ),
    },
  ];

  const summary = open && (
    <>
      <Detail label="Request ID">{open.id}</Detail>
      <Detail label="Requester">{open.requester.name}</Detail>
      <Detail label="Resource">{open.object}</Detail>
      <Detail label="Access Duration">{open.duration}</Detail>
    </>
  );

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Approvals' }]} activeGlobalItem="#/user-view/approvals">
      <ContentHeader icon="Check" title="Approvals" subtitle="Review and manage access requests" />
      <div className={styles.page}>
        <div className={styles.cards}>
          <div className={styles.stat}>
            <span className={styles.quickTitle}>Pending Approvals</span>
            <span className={styles.quickValue}>{pendingCount}</span>
            <span className={styles.quickText}>Awaiting your review</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.quickTitle}>Approved Today</span>
            <span className={styles.quickValue}>12</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.quickTitle}>Rejected Today</span>
            <span className={styles.quickValue}>1</span>
          </div>
        </div>

        <Tabs
          ariaLabel="Approval requests"
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(1);
          }}
          items={TABS.map((t) => ({
            value: t,
            label: `${t} (${t === 'Pending' ? pendingCount : t === 'Previous' ? requests.length - pendingCount : requests.length})`,
          }))}
        />
        <DataTable
          ariaLabel="Approval requests"
          columns={columns}
          rows={shown.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)}
          emptyState={{ title: 'No requests', description: 'Nothing matches this filter.' }}
        />
        <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
      </div>

      <SideSheet
        open={open !== null}
        onClose={() => setOpenId(null)}
        title={open?.status === 'Pending' ? 'Review Request' : open?.status === 'Approved' ? 'Approved Request' : 'Denied Request'}
        subtitle={open?.status === 'Pending' ? 'Review the details below and approve, deny or escalate this request.' : undefined}
        footer={
          open?.status === 'Pending' ? (
            <>
              <Button variant="secondary" onClick={() => startAction('deny')}>
                Deny
              </Button>
              <Button variant="secondary" onClick={() => startAction('escalate')}>
                Escalate
              </Button>
              <Button onClick={() => startAction('approve')}>Approve</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setOpenId(null)}>
              Close
            </Button>
          )
        }
      >
        {open && (
          <div className={styles.details}>
            <Detail label="Status">
              <StatusBadge status={open.status} />
            </Detail>
            <Detail label="Request ID">{open.id}</Detail>
            <FormField label="Requester">
              <PersonCard person={open.requester} role="Requester" />
            </FormField>
            <Detail label="Requested Object">{open.object}</Detail>
            <Detail label="Description">{open.description}</Detail>
            <FormField label="Owner">
              <PersonCard person={open.owner} role="Owner" />
            </FormField>
            <Detail label="Access Duration">{open.duration}</Detail>
            <Detail label="Reason for Request">{open.reason}</Detail>
            {open.decidedOn && <Detail label={open.status === 'Approved' ? 'Approved On' : 'Denied On'}>{open.decidedOn}</Detail>}
            {open.denialReason && <Detail label="Reason for Denial">{open.denialReason}</Detail>}
          </div>
        )}
      </SideSheet>

      <Modal
        open={action === 'approve'}
        onClose={() => setAction(null)}
        size="s"
        title="Approve Request"
        subtitle="Review and confirm this approval"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button onClick={() => decide('Approved')}>Approve</Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Are you sure you want to approve this access request?</p>
          {summary}
          <FormField label="Comments (Optional)">
            <Textarea value={comment} placeholder="Add any comments about this approval..." onChange={(e) => setComment(e.target.value)} />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={action === 'deny'}
        onClose={() => setAction(null)}
        size="s"
        title="Deny Request"
        subtitle="A reason is required to deny this request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button disabled={!comment.trim()} onClick={() => decide('Denied')}>
              Deny
            </Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Are you sure you want to deny this access request?</p>
          {summary}
          <FormField label="Reason for Denial" required helperText="Reason will be shared with the requester.">
            <Textarea value={comment} placeholder="Enter the reason for denying this request..." onChange={(e) => setComment(e.target.value)} />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={action === 'escalate'}
        onClose={() => setAction(null)}
        size="s"
        title="Escalate Request"
        subtitle="Send escalation message to the resource owner's manager"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button disabled={!escalateTo.trim()} onClick={escalate}>
              Send Escalation
            </Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Send an escalation email to the resource owner's manager for confirmation.</p>
          <FormField label="To" required>
            <TextInput value={escalateTo} placeholder="manager@company.com" onChange={(e) => setEscalateTo(e.target.value)} />
          </FormField>
          <FormField label="Subject">
            <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} />
          </FormField>
          <FormField label="Message">
            <Textarea defaultValue="Please review and confirm manager escalation terms." />
          </FormField>
        </div>
      </Modal>
    </AppShell>
  );
}
