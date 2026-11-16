/**
 * userViewData — sample data for the self-service screens, taken from the
 * Figma sample rows in ARS_WebUI2_User-View-Approvals. The app has no
 * access-request data of its own.
 */

import type { AvatarTone } from '../../components/Avatar/Avatar.js';

export type AccessStatus = 'Active' | 'Pending' | 'Inactive' | 'Revoked';

export interface AccessRecord {
  id: string;
  name: string;
  type: string;
  status: AccessStatus;
  about: string;
  /** Time left, "Long term" or "Expired". */
  remaining: string;
  autoExtend: boolean;
}

export const ACCESS_RECORDS: AccessRecord[] = [
  { id: 'a1', name: 'Finance-Admin-Group', type: 'Group', status: 'Active', about: 'Administrative access to finance resources', remaining: '4h 15m', autoExtend: true },
  { id: 'a2', name: 'HR-Policy-Read', type: 'Policy', status: 'Pending', about: 'Read-only policy for HR files', remaining: '19h 30m', autoExtend: false },
  { id: 'a3', name: 'IT-Ops-Directory', type: 'Directory', status: 'Active', about: 'Full directory access for operations and monitoring', remaining: 'Long term', autoExtend: true },
  { id: 'a4', name: 'Shared-Documents-Folder', type: 'Folder', status: 'Active', about: 'Shared documentation and collaboration workspace', remaining: '1d 22h 45m', autoExtend: false },
  { id: 'a5', name: 'Database-Admin-Group', type: 'Group', status: 'Revoked', about: 'Database privilege access revoked following violation', remaining: 'Long term', autoExtend: false },
  { id: 'a6', name: 'Guest-Access-Policy', type: 'Policy', status: 'Inactive', about: 'Temporary guest permissions for consultants', remaining: 'Expired', autoExtend: false },
  { id: 'a7', name: 'Engineering-Folder', type: 'Folder', status: 'Active', about: 'Developer codebase and platform architecture wiki', remaining: 'Long term', autoExtend: true },
  { id: 'a8', name: 'Marketing-Directory', type: 'Directory', status: 'Pending', about: 'Campaign assets and public relations directories', remaining: '3d 14h 22m', autoExtend: false },
];

export interface Person {
  name: string;
  email: string;
  /** Portrait, when the person has one (Figma draws John Smith and Lisa Park with photos). */
  photo?: string;
  /** Colour of the initials avatar. */
  tone?: AvatarTone;
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
  /** Date Requested, as Figma writes it (MM/DD/YYYY). */
  requested: string;
  decidedOn?: string;
  decidedBy?: Person;
  denialReason?: string;
}

// The person cards' avatars as Figma draws them (ARS_Person card 10301:2300 in the side sheets 10300:2178,
// 10300:8498, 10300:8588); people Figma doesn't draw get a colour from their name.
const PHOTOS: Record<string, string> = {
  'John Smith': '/avatars/people/men-32.jpg',
  'Lisa Park': '/avatars/people/women-44.jpg',
};
const TONES: Record<string, AvatarTone> = {
  'Sarah Mitchell': 'blue',
  'Michael Chen': 'purple',
  'Emily Rodriguez': 'pink',
  'James Wilson': 'green',
};
const TONE_CYCLE: AvatarTone[] = ['blue', 'purple', 'pink', 'green', 'orange'];

const person = (name: string): Person => ({
  name,
  email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
  photo: PHOTOS[name],
  tone: TONES[name] ?? TONE_CYCLE[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % TONE_CYCLE.length],
});

const FIRST: Array<Omit<ApprovalRequest, 'requester' | 'owner' | 'decidedBy'> & { requester: string; owner: string; decidedBy?: string }> = [
  { id: 'REQ-001', requester: 'John Smith', object: 'Finance-Admin Group', objectType: 'Directory', description: 'Campaign assets and public relations directories', owner: 'Sarah Mitchell', duration: '24 Hours', status: 'Pending', requested: '11/11/2026', reason: 'Need access to review Q4 financial reports for the upcoming board presentation.' },
  { id: 'REQ-002', requester: 'Sarah Johnson', object: 'IT-Support Role', objectType: 'Role', description: 'Helpdesk tooling and ticket queue administration', owner: 'David Chen', duration: 'Permanent', status: 'Pending', requested: '10/01/2026', reason: 'Covering the helpdesk rota while the team is short-staffed.' },
  { id: 'REQ-003', requester: 'Michael Chen', object: 'Database Access', objectType: 'Group', description: 'Access to production database for quarterly security attestation review', owner: 'Emily Rodriguez', duration: '7 Days', status: 'Approved', requested: '06/06/2026', reason: 'Required for Q4 security attestation audit. Need read-only access to verify compliance controls.', decidedOn: '2026-05-15 at 10:32 AM', decidedBy: 'Sarah Mitchell' },
  { id: 'REQ-004', requester: 'Lisa Park', object: 'Marketing Portal', objectType: 'Directory', description: 'Marketing campaign management portal and analytics dashboard', owner: 'James Wilson', duration: '48 Hours', status: 'Denied', requested: '01/01/2026', reason: 'Need access to update Q4 marketing campaign assets and review analytics data.', decidedOn: '2026-05-14 at 3:15 PM', decidedBy: 'James Wilson', denialReason: 'Insufficient business justification. Please resubmit with manager approval and a detailed use case.' },
  { id: 'REQ-005', requester: 'Robert Kim', object: 'Cloud Infrastructure', objectType: 'Directory', description: 'Cloud accounts and deployment pipelines', owner: 'Amanda Torres', duration: 'Permanent', status: 'Pending', requested: '12/25/2025', reason: 'Incident response on call.' },
];

const MORE_NAMES = ['Priya Sharma', 'Marcus Chen', 'Elena Dubois', 'Jamal Rivera', 'Nadia Patel', 'Ethan Hayes', 'Mia Foster', 'Lucas Grant', 'Isabella Reed', 'Mason Clarke', 'Lena Foster'];
const MORE_OBJECTS = ['Sales-Reports', 'Legal-Archive', 'HR-Onboarding', 'Support-Queue', 'Data-Lake', 'Facilities-Portal', 'Analytics-Admin', 'Billing-System', 'Design-Assets', 'Audit-Logs', 'Training-Library'];
const OWNERS = ['Sarah Mitchell', 'David Chen', 'Emily Rodriguez', 'James Wilson', 'Amanda Torres'];
const DURATIONS = ['24 Hours', '48 Hours', '7 Days', '30 Days', 'Permanent'];

export const APPROVAL_REQUESTS: ApprovalRequest[] = [
  ...FIRST.map((r) => ({
    ...r,
    requester: person(r.requester),
    owner: person(r.owner),
    decidedBy: r.decidedBy ? person(r.decidedBy) : undefined,
  })),
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
    // Figma's five dates are on the first five rows; the rest get earlier 2025 dates.
    requested: `${String(11 - (i % 11)).padStart(2, '0')}/${String(20 - i).padStart(2, '0')}/2025`,
    decidedOn: `2026-05-${String(12 - (i % 9)).padStart(2, '0')} at 9:${String(10 + i).padStart(2, '0')} AM`,
    decidedBy: person(OWNERS[i % OWNERS.length]),
    ...(i % 4 === 3 && { denialReason: 'The request did not match the access policy for this resource.' }),
  })),
];

type RequestableObject = { name: string; type: string; description: string; owner: Person };

// Figma's request sheet offers "100 Available objects" (10199:7056); the first five are its sample rows, and
// Marketing-Directory is the one it shows chosen, owned by Sarah Mitchell.
const FIGMA_OBJECTS: RequestableObject[] = [
  { name: 'Finance-Admin-Group', type: 'Group', description: 'Administrative access to finance resources', owner: person('Sarah Mitchell') },
  { name: 'HR-Policy-Read', type: 'Policy', description: 'Read-only policy for HR files', owner: person('David Chen') },
  { name: 'Shared-Documents-Folder', type: 'Folder', description: 'Shared documentation and collaboration workspace', owner: person('Emily Rodriguez') },
  { name: 'Marketing-Directory', type: 'Directory', description: 'Campaign assets and public relations directories', owner: person('Sarah Mitchell') },
  { name: 'Engineering-Folder', type: 'Folder', description: 'Developer codebase and platform architecture wiki', owner: person('Amanda Torres') },
];
const AREAS = ['Sales', 'Legal', 'Support', 'Payroll', 'Design', 'Security', 'Research', 'Facilities', 'Operations', 'Training', 'Procurement', 'Analytics', 'Compliance', 'Partners', 'Product', 'Quality', 'Logistics', 'Treasury', 'Recruiting'];
const KINDS: Array<{ suffix: string; type: string; text: (area: string) => string }> = [
  { suffix: 'Group', type: 'Group', text: (a) => `Members of the ${a.toLowerCase()} team` },
  { suffix: 'Folder', type: 'Folder', text: (a) => `Shared ${a.toLowerCase()} documents` },
  { suffix: 'Directory', type: 'Directory', text: (a) => `${a} resources and contacts` },
  { suffix: 'Policy', type: 'Policy', text: (a) => `Access policy for ${a.toLowerCase()} data` },
  { suffix: 'Role', type: 'Role', text: (a) => `${a} administration role` },
];

export const AVAILABLE_OBJECTS: RequestableObject[] = [
  ...FIGMA_OBJECTS,
  ...AREAS.flatMap((area, a) =>
    KINDS.map((k, k2) => ({
      name: `${area}-${k.suffix}`,
      type: k.type,
      description: k.text(area),
      owner: person(OWNERS[(a + k2) % OWNERS.length]),
    })),
  ),
].slice(0, 100);

export const ACCESS_DURATIONS = ['24 Hours', '48 Hours', '7 Days', '30 Days', 'Permanent'];
