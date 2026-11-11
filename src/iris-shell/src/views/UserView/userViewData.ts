/**
 * userViewData — sample data for the self-service screens, taken from the
 * Figma sample rows in ARS_WebUI2_User-View-Approvals. The app has no
 * access-request data of its own.
 */

export type AccessStatus = 'Active' | 'Pending' | 'Inactive' | 'Revoked';

export interface AccessRecord {
  id: string;
  name: string;
  type: string;
  status: AccessStatus;
  about: string;
  /** Time left, "Permanent", "Expired" or "-". */
  remaining: string;
  autoExtend: boolean;
}

export const ACCESS_RECORDS: AccessRecord[] = [
  { id: 'a1', name: 'Finance-Admin-Group', type: 'Group', status: 'Active', about: 'Administrative access to finance resources', remaining: '4h 15m', autoExtend: true },
  { id: 'a2', name: 'HR-Policy-Read', type: 'Policy', status: 'Pending', about: 'Read-only policy for HR files', remaining: '19h 30m', autoExtend: false },
  { id: 'a3', name: 'IT-Ops-Directory', type: 'Directory', status: 'Active', about: 'Full directory access for operations and monitoring', remaining: 'Permanent', autoExtend: false },
  { id: 'a4', name: 'Shared-Documents-Folder', type: 'Folder', status: 'Active', about: 'Shared documentation and collaboration workspace', remaining: '1d 22h 45m', autoExtend: true },
  { id: 'a5', name: 'Database-Admin-Group', type: 'Group', status: 'Revoked', about: 'Database privilege access revoked following violation', remaining: '-', autoExtend: false },
  { id: 'a6', name: 'Guest-Access-Policy', type: 'Policy', status: 'Inactive', about: 'Temporary guest permissions for consultants', remaining: 'Expired', autoExtend: false },
  { id: 'a7', name: 'Engineering-Folder', type: 'Folder', status: 'Pending', about: 'Developer codebase and platform architecture wiki', remaining: '2d 6h', autoExtend: false },
  { id: 'a8', name: 'Marketing-Directory', type: 'Directory', status: 'Active', about: 'Campaign assets and public relations directories', remaining: '3d 14h 22m', autoExtend: true },
];

export interface Person {
  name: string;
  email: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Denied';

export interface ApprovalRequest {
  id: string;
  requester: Person;
  object: string;
  objectType: string;
  description: string;
  owner: Person;
  duration: string;
  status: RequestStatus;
  reason: string;
  decidedOn?: string;
  denialReason?: string;
}

const person = (name: string): Person => ({ name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com` });

const FIRST: Array<Omit<ApprovalRequest, 'requester' | 'owner'> & { requester: string; owner: string }> = [
  { id: 'REQ-001', requester: 'John Smith', object: 'Finance-Admin Group', objectType: 'Directory', description: 'Campaign assets and public relations directories', owner: 'Sarah Mitchell', duration: '24 Hours', status: 'Pending', reason: 'Need access to review Q4 financial reports for the upcoming board presentation.' },
  { id: 'REQ-002', requester: 'Sarah Johnson', object: 'IT-Support Role', objectType: 'Role', description: 'Helpdesk tooling and ticket queue administration', owner: 'David Chen', duration: 'Permanent', status: 'Pending', reason: 'Covering the helpdesk rota while the team is short-staffed.' },
  { id: 'REQ-003', requester: 'Michael Chen', object: 'Database Access', objectType: 'Directory', description: 'Read access to the reporting database', owner: 'Emily Rodriguez', duration: '7 Days', status: 'Approved', reason: 'Quarterly reporting.', decidedOn: '2026-05-13 at 10:20 AM' },
  { id: 'REQ-004', requester: 'Lisa Park', object: 'Marketing Portal', objectType: 'Directory', description: 'Marketing campaign management portal and analytics dashboard', owner: 'James Wilson', duration: '48 Hours', status: 'Denied', reason: 'Need access to update Q4 marketing campaign assets and review analytics data.', decidedOn: '2026-05-14 at 3:15 PM', denialReason: 'Insufficient business justification. Please resubmit with manager approval and a detailed use case.' },
  { id: 'REQ-005', requester: 'Robert Kim', object: 'Cloud Infrastructure', objectType: 'Directory', description: 'Cloud accounts and deployment pipelines', owner: 'Amanda Torres', duration: '24 Hours', status: 'Pending', reason: 'Incident response on call.' },
];

const MORE_NAMES = ['Priya Sharma', 'Marcus Chen', 'Elena Dubois', 'Jamal Rivera', 'Nadia Patel', 'Ethan Hayes', 'Mia Foster', 'Lucas Grant', 'Isabella Reed', 'Mason Clarke', 'Lena Foster'];
const MORE_OBJECTS = ['Sales-Reports', 'Legal-Archive', 'HR-Onboarding', 'Support-Queue', 'Data-Lake', 'Facilities-Portal', 'Analytics-Admin', 'Billing-System', 'Design-Assets', 'Audit-Logs', 'Training-Library'];
const OWNERS = ['Sarah Mitchell', 'David Chen', 'Emily Rodriguez', 'James Wilson', 'Amanda Torres'];
const DURATIONS = ['24 Hours', '48 Hours', '7 Days', '30 Days', 'Permanent'];

export const APPROVAL_REQUESTS: ApprovalRequest[] = [
  ...FIRST.map((r) => ({ ...r, requester: person(r.requester), owner: person(r.owner) })),
  ...MORE_NAMES.map<ApprovalRequest>((name, i) => ({
    id: `REQ-${String(i + 6).padStart(3, '0')}`,
    requester: person(name),
    object: MORE_OBJECTS[i],
    objectType: i % 2 ? 'Folder' : 'Group',
    description: `Access to ${MORE_OBJECTS[i].replace(/-/g, ' ').toLowerCase()}.`,
    owner: person(OWNERS[i % OWNERS.length]),
    duration: DURATIONS[i % DURATIONS.length],
    status: i % 4 === 3 ? 'Denied' : 'Approved',
    reason: 'Needed for current project work.',
    decidedOn: `2026-05-${String(12 - (i % 9)).padStart(2, '0')} at 9:${String(10 + i).padStart(2, '0')} AM`,
    ...(i % 4 === 3 && { denialReason: 'The request did not match the access policy for this resource.' }),
  })),
];

export const AVAILABLE_OBJECTS: Array<{ name: string; type: string; description: string; owner: Person }> = [
  { name: 'Finance-Admin-Group', type: 'Group', description: 'Administrative access to finance resources', owner: person('Sarah Mitchell') },
  { name: 'HR-Policy-Read', type: 'Policy', description: 'Read-only policy for HR files', owner: person('David Chen') },
  { name: 'Shared-Documents-Folder', type: 'Folder', description: 'Shared documentation and collaboration workspace', owner: person('Emily Rodriguez') },
  { name: 'Marketing-Directory', type: 'Directory', description: 'Campaign assets and public relations directories', owner: person('James Wilson') },
  { name: 'Engineering-Folder', type: 'Folder', description: 'Developer codebase and platform architecture wiki', owner: person('Amanda Torres') },
];

export const ACCESS_DURATIONS = ['24 Hours', '48 Hours', '7 Days', '30 Days', 'Permanent'];
