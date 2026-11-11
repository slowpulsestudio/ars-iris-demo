import { useMemo, useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { useCurrentUser } from '../../lib/currentUser.js';
import { setHashParams, slug, useHashParam } from '../../lib/hashState.js';
import { showToast } from '../../lib/toastStore.js';
import { Banner } from '../../components/Banner/Banner.js';
import { Button } from '../../components/Button/Button.js';
import { DataTable, type DataTableColumn } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Modal } from '../../components/Modal/Modal.js';
import { Pagination } from '../../components/Pagination/Pagination.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { Tabs } from '../../components/Tabs/Tabs.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { Detail, PageHeader, PersonCard, StatusBadge } from './parts.js';
import { APPROVAL_REQUESTS, type ApprovalRequest, type RequestStatus } from './userViewData.js';
import styles from './UserView.module.css';

const PAGE_SIZE = 10;
const TABS = [
  { value: 'All', match: () => true },
  { value: 'Pending', match: (r: ApprovalRequest) => r.status === 'Pending' },
  { value: 'Previous', match: (r: ApprovalRequest) => r.status !== 'Pending' },
];
type Action = 'approve' | 'deny' | 'escalate';

const COLUMNS: DataTableColumn<ApprovalRequest>[] = [
  { key: 'id', header: 'Request ID', icon: 'Hash', width: 150, cell: (r) => r.id },
  { key: 'requester', header: 'Requester', icon: 'User', grow: 1, minWidth: 150, cell: (r) => r.requester.name },
  { key: 'object', header: 'Requested Object', icon: 'Folder', grow: 2, minWidth: 190, cell: (r) => r.object },
  { key: 'owner', header: 'Owner', icon: 'ShieldCheck', grow: 1, minWidth: 150, cell: (r) => r.owner.name },
  { key: 'duration', header: 'Access Duration', icon: 'ClockCountdown', width: 180, cell: (r) => r.duration },
  { key: 'status', header: 'Status', icon: 'CheckCircle', width: 120, cell: (r) => <StatusBadge status={r.status} /> },
];

function now(): string {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

/** ApprovalsPage — access requests to approve, deny or escalate (Design-1-Approvals-Dashboard 10199:7351, its modals and side sheets). */
export function ApprovalsPage() {
  const me = useCurrentUser();
  const [requests, setRequests] = useState<ApprovalRequest[]>(APPROVAL_REQUESTS);
  // The tab, the open request and the open modal live in the address (?tab=pending&request=REQ-002&modal=approve).
  const [tabParam] = useHashParam('tab');
  const tab = TABS.find((t) => slug(t.value) === tabParam)?.value ?? TABS[0].value;
  const setTab = (next: string) =>
    setHashParams({ tab: next === TABS[0].value ? null : slug(next), request: null, modal: null });
  const [openId] = useHashParam('request');
  const setOpenId = (id: string | null) => setHashParams(id ? { request: id } : { request: null, modal: null });
  const [actionParam] = useHashParam('modal');
  const action = (['approve', 'deny', 'escalate'] as const).find((a) => a === actionParam) ?? null;
  const setAction = (next: Action | null) => setHashParams({ modal: next });
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [comment, setComment] = useState('');
  const [escalation, setEscalation] = useState({ to: '', subject: '', message: '' });
  const [approvedToday, setApprovedToday] = useState(12);
  const [rejectedToday, setRejectedToday] = useState(1);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = TABS.find((t) => t.value === tab)!.match;
    return requests.filter(
      (r) => match(r) && (!q || [r.id, r.requester.name, r.object, r.owner.name].some((v) => v.toLowerCase().includes(q))),
    );
  }, [requests, tab, query]);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const open = requests.find((r) => r.id === openId) ?? null;

  const startAction = (next: Action) => {
    setComment('');
    setEscalation({ to: '', subject: '', message: '' });
    setAction(next);
  };

  const decide = (status: RequestStatus) => {
    if (!open) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === open.id
          ? {
              ...r,
              status,
              decidedOn: now(),
              decidedBy: { name: me.name, email: me.email ?? '' },
              denialReason: status === 'Denied' ? comment.trim() : undefined,
            }
          : r,
      ),
    );
    if (status === 'Approved') setApprovedToday((n) => n + 1);
    else setRejectedToday((n) => n + 1);
    setAction(null);
    setOpenId(null);
    showToast(status === 'Approved' ? 'Request approved' : 'Request denied', { supportingText: `${open.id} · ${open.object}` });
  };

  const escalate = () => {
    if (!open) return;
    setAction(null);
    showToast('Escalation sent', { supportingText: `${open.id} was sent to ${escalation.to.trim()}.` });
  };

  const summary = open && (
    <div className={styles.detailRows}>
      <Detail label="Request ID">{open.id}</Detail>
      <Detail label="Requester">{open.requester.name}</Detail>
      <Detail label="Resource">{open.object}</Detail>
      <Detail label="Access Duration">{open.duration}</Detail>
    </div>
  );

  const decided = open && open.status !== 'Pending';
  const approved = open?.status === 'Approved';

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Approvals' }]} activeGlobalItem="#/user-view/approvals">
      <div className={styles.page}>
        <PageHeader
          title="Approvals"
          subtitle="Review and approve access requests"
          actions={
            <>
              {searchOpen && (
                <TextInput
                  autoFocus
                  value={query}
                  placeholder="Search requests"
                  aria-label="Search requests"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              )}
              <Tooltip label="Search">
                <IconButton
                  icon="MagnifyingGlass"
                  variant="secondary"
                  ariaLabel="Search"
                  aria-expanded={searchOpen}
                  onClick={() => {
                    if (searchOpen) setQuery('');
                    setSearchOpen((v) => !v);
                  }}
                />
              </Tooltip>
            </>
          }
        />

        <div className={styles.cards}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Pending Approvals</span>
            <span className={styles.statValue}>{pendingCount}</span>
            <span className={styles.statText}>Awaiting your review</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Approved Today</span>
            <span className={styles.statValue}>{approvedToday}</span>
            <span className={styles.statText}>Successfully provisioned</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Rejected Today</span>
            <span className={styles.statValue}>{rejectedToday}</span>
            <span className={styles.statText}>Access denied</span>
          </div>
        </div>

        <div className={styles.records}>
          <Tabs
            ariaLabel="Approval requests"
            value={tab}
            onChange={(next) => {
              setTab(next);
              setPage(1);
            }}
            items={TABS.map((t) => ({ value: t.value, label: `${t.value} (${requests.filter(t.match).length})` }))}
          />
          <DataTable
            ariaLabel="Approval requests"
            columns={COLUMNS}
            rows={shown.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)}
            rowLabel={(r) => r.id}
            hideRowActions
            onRowClick={(r) => setOpenId(r.id)}
            emptyState={{ title: 'No requests', description: 'Nothing matches this filter.' }}
          />
        </div>
        <div className={styles.pagination}>
          <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </div>

      <SideSheet
        open={open !== null}
        onClose={() => setOpenId(null)}
        title={decided ? 'Request Details' : 'Review Request'}
        subtitle={
          decided
            ? `This request has been ${approved ? 'approved' : 'denied'}.`
            : 'Review the access request details below and approve or deny.'
        }
        footer={
          decided ? (
            <Button variant="secondary" onClick={() => setOpenId(null)}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => startAction('deny')}>
                Deny
              </Button>
              <Button variant="secondary" onClick={() => startAction('escalate')}>
                Escalate
              </Button>
              <Button onClick={() => startAction('approve')}>Approve</Button>
            </>
          )
        }
      >
        {open && (
          <div className={styles.details}>
            {decided && (
              <>
                <Banner tone={approved ? 'success' : 'error'} colored title={approved ? 'Approved' : 'Denied'}>
                  {approved
                    ? 'This request has been approved and provisioned successfully.'
                    : 'This request has been denied due to policy or administrative reasons.'}
                </Banner>
                <p className={styles.caption}>Decision Details</p>
                {open.decidedBy && <PersonCard person={open.decidedBy} role="Owner" />}
                <div className={styles.detailRows}>
                  <Detail label={approved ? 'Approved on' : 'Denied on'}>{open.decidedOn}</Detail>
                  {open.denialReason && (
                    <Detail label="Denial Reason" tone="error">
                      {open.denialReason}
                    </Detail>
                  )}
                </div>
                <hr className={styles.divider} />
              </>
            )}
            <div className={styles.detailRows}>
              <Detail label="Request ID">{open.id}</Detail>
            </div>
            <PersonCard person={open.requester} role="Requester" />
            <div className={styles.detailRows}>
              <Detail label="Requested Object">{open.object}</Detail>
              <Detail label="Object Type">{open.objectType}</Detail>
              <Detail label="Description">{open.description}</Detail>
            </div>
            <PersonCard person={open.owner} role="Owner" />
            <div className={styles.detailRows}>
              <Detail label="Access Duration">{open.duration}</Detail>
              <Detail label="Reason for Request">{open.reason}</Detail>
            </div>
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
          <FormField label="Comments (Optional)" help="Add any optional notes for the audit log.">
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
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
          <p className={styles.messageError}>Are you sure you want to deny this access request?</p>
          {summary}
          <FormField label="Reason for Denial" required help="Reason will be shared with the requester.">
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
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
            <Button
              disabled={!escalation.to.trim() || !escalation.subject.trim() || !escalation.message.trim()}
              onClick={escalate}
            >
              Send Escalation
            </Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Send an escalation email to the resource owner's manager for confirmation.</p>
          <FormField label="To" required>
            <TextInput type="email" value={escalation.to} onChange={(e) => setEscalation((v) => ({ ...v, to: e.target.value }))} />
          </FormField>
          <FormField label="Subject" required>
            <TextInput value={escalation.subject} onChange={(e) => setEscalation((v) => ({ ...v, subject: e.target.value }))} />
          </FormField>
          <FormField label="Message" required help="Please review and confirm manager escalation terms.">
            <Textarea value={escalation.message} onChange={(e) => setEscalation((v) => ({ ...v, message: e.target.value }))} />
          </FormField>
        </div>
      </Modal>
    </AppShell>
  );
}
