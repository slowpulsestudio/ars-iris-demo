import { useEffect, useMemo, useState, type Ref } from 'react';
import { ARSPagination } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { cx } from '../../lib/cx.js';
import { useCurrentUser } from '../../lib/currentUser.js';
import { setHashParams, slug, useHashParam } from '../../lib/hashState.js';
import { showToast } from '../../lib/toastStore.js';
import { ActionBar } from '../../components/ActionBar/ActionBar.js';
import { Avatar } from '../../components/Avatar/Avatar.js';
import { Banner } from '../../components/Banner/Banner.js';
import { Button } from '../../components/Button/Button.js';
import { DataTable, type DataTableColumn, type RowKey } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Menu } from '../../components/Menu/Menu.js';
import { Modal } from '../../components/Modal/Modal.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { Tabs } from '../../components/Tabs/Tabs.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { Detail, PageHeader, PersonCard, SearchField, StatusBadge } from './parts.js';
import { StepRow, WorkflowTimeline, type WorkflowStep } from './WorkflowTimeline.js';
import { APPROVAL_REQUESTS, type ApprovalRequest, type RequestStatus } from './userViewData.js';
import styles from './UserView.module.css';

const PAGE_SIZE_OPTIONS = [10, 20, 30];
const TABS = [
  { value: 'All', match: () => true },
  { value: 'Pending', match: (r: ApprovalRequest) => r.status === 'Pending' },
  { value: 'Previous', match: (r: ApprovalRequest) => r.status !== 'Pending' },
];
const SHEET_TABS = ['Request info', 'Request steps'];
type Action = 'approve' | 'deny' | 'escalate';

function now(): string {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

/** "Me" in a step card: the signed-in approver (Figma "Attestor" rows in 10315:3374). */
function Me({ name, photo }: { name: string; photo?: string }) {
  return (
    <span className={styles.me}>
      <Avatar name={name} src={photo} size="m" />
      <span className={styles.meName}>Me</span>
      <span>Attestor</span>
    </span>
  );
}

/**
 * The request's steps (Figma Request steps 10315:2999). A pending request is at "Approver review"; a decided one
 * has every step done. Figma fills the first card with sample "Group name / Security Users" rows, kept as drawn.
 */
function stepsFor(r: ApprovalRequest, me: { name: string; photo?: string }): { steps: WorkflowStep[]; current: number } {
  const decided = r.status !== 'Pending';
  const steps: WorkflowStep[] = [
    {
      title: 'Approval case created',
      content: (
        <>
          {[0, 1, 2, 3].map((i) => (
            <StepRow key={i} label="Group name" value="Security Users" />
          ))}
        </>
      ),
    },
    {
      title: 'Assigned to approver',
      content: (
        <>
          <span>Routed to you for review</span>
          <Me {...me} />
        </>
      ),
    },
    { title: 'Pending approval', content: 'Daily attestation in progress  -  AI recommends Revise' },
    { title: 'Approver review', content: <Me {...me} /> },
    {
      title: 'Approval decision',
      content: decided ? `${r.status} by ${r.decidedBy?.name ?? 'the approver'} on ${r.decidedOn}` : 'Awaiting certify or revoke decision',
    },
    { title: 'Closed approval case', content: decided ? 'Case closed' : 'Case will close once a decision is recorded' },
  ];
  return { steps, current: decided ? steps.length : 3 };
}

/** ApprovalsPage — access requests to approve, deny or escalate (Design-1-Approvals-Dashboard 10199:7351, its modals and side sheets). */
export function ApprovalsPage() {
  const me = useCurrentUser();
  const [requests, setRequests] = useState<ApprovalRequest[]>(APPROVAL_REQUESTS);
  // The tab, the open request and the open modal live in the address (?tab=pending&request=REQ-002&modal=approve).
  const [tabParam] = useHashParam('tab');
  const tab = TABS.find((t) => slug(t.value) === tabParam)?.value ?? TABS[0].value;
  const setTab = (next: string) =>
    setHashParams({ tab: next === TABS[0].value ? null : slug(next), request: null, modal: null, target: null, view: null });
  const [openId] = useHashParam('request');
  // Opening another request starts on Request info; Request steps is `view=steps`.
  const setOpenId = (id: string | null) =>
    setHashParams(id ? { request: id, view: null } : { request: null, modal: null, target: null, view: null });
  const [actionParam] = useHashParam('modal');
  const action = (['approve', 'deny', 'escalate'] as const).find((a) => a === actionParam) ?? null;
  const [viewParam] = useHashParam('view');
  const [targetParam] = useHashParam('target');
  const sheetTab = viewParam === 'steps' ? SHEET_TABS[1] : SHEET_TABS[0];
  const setSheetTab = (next: string) => setHashParams({ view: next === SHEET_TABS[1] ? 'steps' : null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<RowKey>>(new Set());
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [approvedToday, setApprovedToday] = useState(12);
  const [rejectedToday, setRejectedToday] = useState(1);

  useEffect(() => {
    setComment('');
    setMessage('');
    setShowErrors(false);
  }, [actionParam, targetParam, openId]);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = TABS.find((t) => t.value === tab)!.match;
    return requests.filter(
      (r) =>
        match(r) &&
        (!q || [r.id, r.requester.name, r.requester.email, r.object, r.owner.name].some((v) => v.toLowerCase().includes(q))),
    );
  }, [requests, tab, query]);
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const open = requests.find((r) => r.id === openId) ?? null;
  const targets = targetParam
    ? requests.filter((r) => targetParam.split(',').includes(r.id) && r.status === 'Pending')
    : open
      ? (open.status === 'Pending' ? [open] : [])
      : [];
  const selectedPending = requests.filter((r) => selected.has(r.id) && r.status === 'Pending');

  const startAction = (next: Action, ids: string[] | null = null) => {
    setComment('');
    setMessage('');
    setShowErrors(false);
    setHashParams({ modal: next, target: ids?.join(',') ?? null });
  };

  const closeAction = () => {
    setHashParams({ modal: null, target: null });
  };

  const decide = (status: RequestStatus) => {
    if (targets.length === 0) return;
    if (status === 'Denied' && !comment.trim()) {
      setShowErrors(true);
      return;
    }
    const ids = new Set(targets.map((t) => t.id));
    setRequests((prev) =>
      prev.map((r) =>
        ids.has(r.id)
          ? {
              ...r,
              status,
              decidedOn: now(),
              decidedBy: { name: me.name, email: me.email ?? '', photo: me.src },
              denialReason: status === 'Denied' ? comment.trim() : undefined,
            }
          : r,
      ),
    );
    if (status === 'Approved') setApprovedToday((n) => n + ids.size);
    else setRejectedToday((n) => n + ids.size);
    setSelected(new Set());
    setHashParams({ modal: null, request: null, target: null, view: null });
    showToast(status === 'Approved' ? 'Request approved' : 'Request denied', {
      supportingText: targets.length === 1 ? `${targets[0].id} · ${targets[0].object}` : `${targets.length} requests`,
    });
  };

  const escalate = () => {
    if (!message.trim()) {
      setShowErrors(true);
      return;
    }
    closeAction();
    showToast('Escalation sent', {
      supportingText: `${targets.length === 1 ? targets[0].id : `${targets.length} requests`} sent to the resource owner's manager.`,
    });
  };

  const columns: DataTableColumn<ApprovalRequest>[] = [
    { key: 'id', header: 'Request ID', width: 110, cell: (r) => r.id },
    { key: 'requester', header: 'Requester', icon: 'User', grow: 1, minWidth: 140, cell: (r) => r.requester.name },
    { key: 'object', header: 'Requested Object', grow: 1, minWidth: 170, cell: (r) => r.object },
    { key: 'owner', header: 'Owner', icon: 'ShieldCheck', grow: 1, minWidth: 160, cell: (r) => r.owner.name },
    { key: 'duration', header: 'Access Duration', width: 160, cell: (r) => r.duration },
    { key: 'requested', header: 'Date Requested', width: 160, cell: (r) => r.requested },
    { key: 'status', header: 'Status', icon: 'CheckCircle', width: 120, cell: (r) => <StatusBadge status={r.status} /> },
  ];

  const summary =
    targets.length === 1 ? (
      <div className={styles.detailRows}>
        <Detail label="Request ID">{targets[0].id}</Detail>
        <Detail label="Requester">{targets[0].requester.name}</Detail>
        <Detail label="Resource">{targets[0].object}</Detail>
        <Detail label="Access Duration">{targets[0].duration}</Detail>
      </div>
    ) : (
      <div className={styles.detailRows}>
        <Detail label="Requests">{targets.map((t) => t.id).join(', ')}</Detail>
      </div>
    );

  const decided = open && open.status !== 'Pending';
  const approved = open?.status === 'Approved';
  const timeline = open && stepsFor(open, { name: me.name, photo: me.src });
  // Figma's wording is for one request; the selection bar can act on several.
  const requestWords = targets.length > 1 ? `these ${targets.length} access requests` : 'this access request';

  const requestInfo = open && (
    <div className={styles.details}>
      {decided && (
        <>
          <Banner
            tone={approved ? 'success' : 'error'}
            colored
            icon={approved ? undefined : 'Warning'}
            className={approved ? undefined : styles.deniedBanner}
            title={approved ? 'Approved' : 'Denied'}
          >
            {approved
              ? 'This request has been approved and provisioned successfully.'
              : 'This request has been denied due to policy or administrative reasons.'}
          </Banner>
          {/* Figma: Approved puts "Approved on" before the decision details (10300:8498); Denied after (10300:8588). */}
          {approved && (
            <div className={styles.detailRows}>
              <Detail label="Approved on">{open.decidedOn}</Detail>
            </div>
          )}
          <p className={styles.caption}>Decision Details</p>
          {open.decidedBy && <PersonCard person={open.decidedBy} role="Owner" />}
          {!approved && (
            <div className={styles.detailRows}>
              <Detail label="Denied on">{open.decidedOn}</Detail>
              {open.denialReason && (
                <Detail label="Denial Reason" tone="error">
                  {open.denialReason}
                </Detail>
              )}
            </div>
          )}
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
  );

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'Approvals' }]} activeGlobalItem="#/user-view/approvals">
      <div className={cx(styles.page, styles.carded)}>
        <PageHeader title="Approvals" subtitle="Review and approve access requests" />

        <div className={styles.cards}>
          <div className={cx(styles.stat, styles.kpi)}>
            <span className={styles.statLabel}>Pending Approvals</span>
            <span className={styles.statValue}>{pendingCount}</span>
            <span className={styles.statText}>Awaiting your review</span>
          </div>
          <div className={cx(styles.stat, styles.kpi)}>
            <span className={styles.statLabel}>Approved Today</span>
            <span className={styles.statValue}>{approvedToday}</span>
            <span className={styles.statText}>Successfully provisioned</span>
          </div>
          <div className={cx(styles.stat, styles.kpi)}>
            <span className={styles.statLabel}>Rejected Today</span>
            <span className={styles.statValue}>{rejectedToday}</span>
            <span className={styles.statText}>Access denied</span>
          </div>
        </div>

        <SearchField
          value={draft}
          onChange={setDraft}
          onSubmit={() => {
            setQuery(draft);
            setPage(1);
          }}
          placeholder="Search by name, email, request ID etc."
        />

        <div className={styles.records}>
          <Tabs
            ariaLabel="Approval requests"
            variant="outlined"
            value={tab}
            onChange={(next) => {
              setTab(next);
              setPage(1);
              setSelected(new Set());
            }}
            items={TABS.map((t) => ({ value: t.value, label: `${t.value} (${requests.filter(t.match).length})` }))}
          />
          <DataTable
            ariaLabel="Approval requests"
            columns={columns}
            rows={shown.slice((safePage - 1) * pageSize, safePage * pageSize)}
            rowLabel={(r) => r.id}
            selected={selected}
            onSelectionChange={setSelected}
            onRowClick={(r) => setOpenId(r.id)}
            headerAction={
              <Tooltip label="Table settings">
                <IconButton
                  icon="SlidersHorizontal"
                  size="s"
                  ariaLabel="Table settings"
                  onClick={() => showToast('Table settings are not available in this prototype')}
                />
              </Tooltip>
            }
            rowActions={(r) => (
              // The menu renders in a portal: keep its keys from reaching the row (DataTable stops the clicks).
              <span onKeyDown={(e) => e.stopPropagation()}>
                <Menu
                  ariaLabel={`Actions for ${r.id}`}
                  align="end"
                  items={(['deny', 'escalate', 'approve'] as const).map((a) => ({
                    kind: 'item',
                    label: a === 'deny' ? 'Deny' : a === 'escalate' ? 'Escalate' : 'Approve',
                    disabled: r.status !== 'Pending',
                    onSelect: () => startAction(a, [r.id]),
                  }))}
                  trigger={({ ref, onClick, expanded }) => (
                    <IconButton
                      ref={ref as Ref<HTMLButtonElement>}
                      icon="DotsThree"
                      size="s"
                      ariaLabel={`Actions for ${r.id}`}
                      aria-haspopup="menu"
                      aria-expanded={expanded}
                      onClick={onClick}
                    />
                  )}
                />
              </span>
            )}
            emptyState={{ title: 'No requests', description: 'Nothing matches this filter.' }}
          />
        </div>
        <ARSPagination
          className={styles.pageBottom}
          page={safePage}
          pageCount={pageCount}
          onPageChange={setPage}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      {/* Figma ARS_Approvals_Action_bar (10320:4472): Select all, then Deny, Escalate and Approve. */}
      <ActionBar
        open={selected.size > 0}
        selectedCount={selected.size}
        onDismiss={() => setSelected(new Set())}
        groups={[
          [{ icon: 'SelectionAll', label: 'Select all', iconOnly: false, onClick: () => setSelected(new Set(shown.map((r) => r.id))) }],
          [
            { label: 'Deny', iconOnly: false, disabled: selectedPending.length === 0, onClick: () => startAction('deny', selectedPending.map((r) => r.id)) },
            { label: 'Escalate', iconOnly: false, disabled: selectedPending.length === 0, onClick: () => startAction('escalate', selectedPending.map((r) => r.id)) },
            { label: 'Approve', iconOnly: false, disabled: selectedPending.length === 0, onClick: () => startAction('approve', selectedPending.map((r) => r.id)) },
          ],
        ]}
      />

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
        {open && timeline && (
          <div className={styles.details}>
            <Tabs
              ariaLabel="Request"
              variant="outlined"
              value={sheetTab}
              onChange={setSheetTab}
              items={[
                { value: SHEET_TABS[0], label: SHEET_TABS[0] },
                // Figma counts 4 on every sheet (10300:2178, 10300:8498, 10300:8588).
                { value: SHEET_TABS[1], label: `${SHEET_TABS[1]} (4)` },
              ]}
            />
            {sheetTab === SHEET_TABS[0] ? requestInfo : <WorkflowTimeline steps={timeline.steps} current={timeline.current} />}
          </div>
        )}
      </SideSheet>

      <Modal
        open={action === 'approve' && targets.length > 0}
        onClose={closeAction}
        size="s"
        headerDivider
        className={styles.approvalModal}
        title="Approve Request"
        subtitle="Review and confirm this approval"
        footer={
          <>
            <Button variant="secondary" onClick={closeAction}>
              Cancel
            </Button>
            <Button onClick={() => decide('Approved')}>Approve</Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Are you sure you want to approve {requestWords}?</p>
          {summary}
          <FormField label="Comments (Optional)" help="Add any optional notes for the audit log.">
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={action === 'deny' && targets.length > 0}
        onClose={closeAction}
        size="s"
        headerDivider
        className={styles.approvalModal}
        title="Deny Request"
        subtitle="A reason is required to deny this request"
        footer={
          <>
            <Button variant="secondary" onClick={closeAction}>
              Cancel
            </Button>
            <Button onClick={() => decide('Denied')}>Deny</Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.messageError}>Are you sure you want to deny {requestWords}?</p>
          {summary}
          <FormField
            label="Reason for Denial"
            required
            requiredTone="error"
            help="Reason will be shared with the requester."
            error={showErrors && !comment.trim() ? 'Enter a reason for the denial.' : undefined}
          >
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={action === 'escalate' && targets.length > 0}
        onClose={closeAction}
        size="s"
        headerDivider
        className={styles.approvalModal}
        title="Escalate Request"
        subtitle="Send escalation message to the resource owner's manager"
        footer={
          <>
            <Button variant="secondary" onClick={closeAction}>
              Cancel
            </Button>
            <Button onClick={escalate}>Send Escalation</Button>
          </>
        }
      >
        <div className={styles.details}>
          <p className={styles.message}>Send an escalation email to the resource owner's manager for confirmation.</p>
          <FormField
            label="Message"
            required
            help="Please review and confirm manager escalation terms."
            error={showErrors && !message.trim() ? 'Enter a message for the manager.' : undefined}
          >
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </FormField>
        </div>
      </Modal>
    </AppShell>
  );
}
