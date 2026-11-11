import { useSyncExternalStore } from 'react';

/**
 * userMemberships — the groups each user is a member of, kept for the
 * session. The directory data has no memberships, so these are sample
 * groups: the ten sample users have the two each that the demo site gives
 * them; any other user gets two picked from the same groups.
 */

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  objectId: string;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** A stable id-shaped string, since the sample groups have no real object ids. */
function objectIdFor(seed: string): string {
  let a = hash(seed);
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0).toString(16).padStart(8, '0');
  };
  const hex = next() + next() + next() + next();
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
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
];

const BY_ID = new Map(SAMPLE_GROUPS.map((g) => [g.id, g]));

/** The groups the demo site gives each sample user. */
const SAMPLE_MEMBERSHIPS: Record<string, string[]> = {
  'isabella-clark': ['platform-admins', 'engineering-leads'],
  'liam-bennett': ['helpdesk-operators', 'regional-managers'],
  'sophia-martinez': ['finance-approvers', 'audit-reviewers'],
  'noah-kim': ['security-readers', 'platform-admins'],
  'mason-patel': ['application-owners', 'helpdesk-operators'],
  'olivia-nguyen': ['engineering-leads', 'finance-approvers'],
  'ethan-brooks': ['regional-managers', 'security-readers'],
  'ava-thompson': ['audit-reviewers', 'platform-admins'],
  'lucas-rivera': ['platform-admins', 'helpdesk-operators'],
  'mia-foster': ['helpdesk-operators', 'finance-approvers'],
};

function defaultsFor(userId: string): UserGroup[] {
  const ids =
    SAMPLE_MEMBERSHIPS[userId] ??
    (() => {
      const h = hash(userId);
      return [SAMPLE_GROUPS[h % SAMPLE_GROUPS.length].id, SAMPLE_GROUPS[(h + 3) % SAMPLE_GROUPS.length].id];
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
