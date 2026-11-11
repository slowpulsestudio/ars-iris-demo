import { hash, objectIdFor } from './sampleData.js';

/**
 * userRoles — the roles assigned to each user. The directory data has no
 * roles, so these are sample roles: a user gets as many as their Overview
 * card and tab label say, picked from the same eight.
 */

export interface UserRole {
  id: string;
  name: string;
  description: string;
  objectId: string;
}

function role(name: string, description: string): UserRole {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return { id, name, description, objectId: objectIdFor(`role-${id}`) };
}

export const SAMPLE_ROLES: UserRole[] = [
  role('Help Desk Administrator', 'Reset passwords and unlock accounts for users in scope.'),
  role('Group Manager', 'Create groups and manage their membership.'),
  role('Account Operator', 'Create, change and disable user accounts.'),
  role('Security Auditor', 'Read-only access to security settings and audit logs.'),
  role('Exchange Recipient Administrator', 'Manage mailboxes and distribution lists.'),
  role('Password Reset Operator', 'Reset passwords only.'),
  role('Access Template Manager', 'Create and assign access templates.'),
  role('Report Viewer', 'View and export directory reports.'),
];

/** How many roles a user has: 1 to 7, the same for a given user every time. */
export function userRoleCount(userId: string): number {
  return 1 + (hash(`roles:${userId}`) % (SAMPLE_ROLES.length - 1));
}

const lists = new Map<string, UserRole[]>();

/** The roles assigned to a user; the same array every time. */
export function userRoles(userId: string): UserRole[] {
  let list = lists.get(userId);
  if (!list) {
    const start = hash(userId) % SAMPLE_ROLES.length;
    list = Array.from({ length: userRoleCount(userId) }, (_, i) => SAMPLE_ROLES[(start + i) % SAMPLE_ROLES.length]);
    lists.set(userId, list);
  }
  return list;
}
