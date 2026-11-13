import { useSyncExternalStore } from 'react';
import { hash, objectIdFor } from './sampleData.js';

/**
 * userMemberships — the groups each user is a member of, kept for the
 * session. The directory data has no memberships, so these are sample
 * groups in the style of the demo site's: each sample user has two
 * different ones, and any other user gets two picked from the same forty.
 */

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  objectId: string;
}

function group(name: string, description: string): UserGroup {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return { id, name, description, objectId: objectIdFor(id) };
}

export const SAMPLE_GROUPS: UserGroup[] = [
  group('Platform Admins', 'Administer the platform and its directory services.'),
  group('Engineering Leads', 'Leads of the engineering teams.'),
  group('Helpdesk Operators', 'First-line support for user and group tasks.'),
  group('Regional Managers', 'Managers of regional offices and teams.'),
  group('Finance Approvers', 'Approve finance and procurement requests.'),
  group('Audit Reviewers', 'Review audit logs and access certifications.'),
  group('Security Readers', 'Read-only access to security reports.'),
  group('Application Owners', 'Own and approve access to business applications.'),
  group('Network Operations', 'Monitor and maintain network services.'),
  group('Database Administrators', 'Run and secure the database servers.'),
  group('Cloud Architects', 'Design and review cloud infrastructure.'),
  group('DevOps Engineers', 'Build and operate delivery pipelines.'),
  group('Incident Responders', 'Respond to security and service incidents.'),
  group('Compliance Officers', 'Track policy compliance and report on it.'),
  group('HR Business Partners', 'Support managers with joiners, movers and leavers.'),
  group('Payroll Processors', 'Run payroll and manage pay records.'),
  group('Procurement Team', 'Raise and approve purchase orders.'),
  group('Legal Reviewers', 'Review contracts and data requests.'),
  group('Marketing Leads', 'Lead campaigns and brand content.'),
  group('Sales Operations', 'Maintain sales systems and reporting.'),
  group('Customer Success', 'Look after key customer accounts.'),
  group('Support Tier 2', 'Second-line support for escalated tickets.'),
  group('QA Engineers', 'Test releases before they ship.'),
  group('Release Managers', 'Plan and approve production releases.'),
  group('Data Analysts', 'Build reports and dashboards.'),
  group('Data Stewards', 'Own data quality and definitions.'),
  group('Backup Operators', 'Run and verify backups.'),
  group('Server Administrators', 'Maintain the Windows and Linux servers.'),
  group('Desktop Support', 'Set up and repair user devices.'),
  group('Mobile Device Managers', 'Manage enrolled phones and tablets.'),
  group('Identity Governance', 'Run access reviews and certifications.'),
  group('Access Reviewers', 'Approve or remove access during reviews.'),
  group('Privileged Access Users', 'Use elevated accounts with approval.'),
  group('VPN Users', 'Remote access through the corporate VPN.'),
  group('Wi-Fi Guests', 'Visitor access to the guest network.'),
  group('Contractors', 'External staff with limited access.'),
  group('Interns', 'Short-term staff on starter access.'),
  group('Executive Assistants', 'Support the leadership team.'),
  group('Facilities Team', 'Manage buildings, badges and equipment.'),
  group('Training Coordinators', 'Run learning programmes and sign-ups.'),
];

const BY_ID = new Map(SAMPLE_GROUPS.map((g) => [g.id, g]));

/** Two different groups for each of the ten sample users, so names rarely repeat. */
const SAMPLE_MEMBERSHIPS: Record<string, string[]> = {
  'isabella-clark': ['platform-admins', 'cloud-architects'],
  'liam-bennett': ['helpdesk-operators', 'incident-responders'],
  'sophia-martinez': ['finance-approvers', 'payroll-processors'],
  'noah-kim': ['security-readers', 'compliance-officers'],
  'mason-patel': ['application-owners', 'release-managers'],
  'olivia-nguyen': ['engineering-leads', 'devops-engineers'],
  'ethan-brooks': ['regional-managers', 'sales-operations'],
  'ava-thompson': ['audit-reviewers', 'identity-governance'],
  'lucas-rivera': ['network-operations', 'server-administrators'],
  'mia-foster': ['support-tier-2', 'customer-success'],
};

function defaultsFor(userId: string): UserGroup[] {
  const ids =
    SAMPLE_MEMBERSHIPS[userId] ??
    (() => {
      // Two groups a good way apart in the list, so other users rarely share a pair.
      const h = hash(userId);
      const first = h % SAMPLE_GROUPS.length;
      const second = (first + 7 + ((h >>> 8) % 20)) % SAMPLE_GROUPS.length;
      return [SAMPLE_GROUPS[first].id, SAMPLE_GROUPS[second].id];
    })();
  return ids.map((id) => BY_ID.get(id)).filter((g): g is UserGroup => Boolean(g));
}

const lists = new Map<string, UserGroup[]>();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function listFor(userId: string): UserGroup[] {
  let list = lists.get(userId);
  if (!list) {
    list = defaultsFor(userId);
    lists.set(userId, list);
  }
  return list;
}

/** The groups a user is a member of; the same array until it changes. */
export function useUserMemberships(userId: string): UserGroup[] {
  return useSyncExternalStore(subscribe, () => listFor(userId));
}

/** Adds the sample groups with these ids to a user's memberships. */
export function addUserMemberships(userId: string, groupIds: string[]): void {
  const have = new Set(listFor(userId).map((g) => g.id));
  const added = groupIds.map((id) => BY_ID.get(id)).filter((g): g is UserGroup => Boolean(g) && !have.has(g!.id));
  if (added.length === 0) return;
  lists.set(userId, [...listFor(userId), ...added]);
  listeners.forEach((cb) => cb());
}

/** Takes a group out of a user's memberships and returns a function that puts it back where it was. */
export function removeUserMembership(userId: string, groupId: string): () => void {
  const list = listFor(userId);
  const at = list.findIndex((g) => g.id === groupId);
  if (at < 0) return () => {};
  const removed = list[at];
  lists.set(userId, list.filter((g) => g.id !== groupId));
  listeners.forEach((cb) => cb());
  return () => {
    const now = listFor(userId);
    if (now.some((g) => g.id === groupId)) return;
    lists.set(userId, [...now.slice(0, at), removed, ...now.slice(at)]);
    listeners.forEach((cb) => cb());
  };
}
