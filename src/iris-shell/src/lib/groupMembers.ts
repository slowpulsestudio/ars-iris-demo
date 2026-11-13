import { getChildren, getParentId, type DirectoryObject } from './directoryData.js';
import type { GroupProps } from './groupDetailsStore.js';
import { hash } from './sampleData.js';

/**
 * groupMembers — a group's members and the groups it is a member of. The directory data has no
 * memberships, so they are picked from the objects near the group: its own folder, the folders beside
 * it and their parent. The same group always gets the same picks.
 */

type Kind = 'groups' | 'users' | 'devices' | 'others';

/** Groups first, then users, as the Memberships table lists them (ARS_WebUI2_Groups 167:8089). */
const ORDER: Kind[] = ['groups', 'users', 'devices', 'others'];

const kindOf = (o: DirectoryObject): Kind =>
  o.type === 'group' ? 'groups' : o.type === 'user' ? 'users' : o.type === 'computer' ? 'devices' : 'others';

/**
 * How a group's members split by type. Figma's Overview for Security Users counts 47 members: 32 users,
 * 8 groups, 5 devices and 2 others (ARS_Group_Overview 158:33620).
 */
export function memberMix(total: number): Record<Kind, number> {
  const users = Math.round(total * 0.68);
  const groups = Math.round(total * 0.17);
  const devices = Math.round(total * 0.11);
  return { users, groups, devices, others: Math.max(0, total - users - groups - devices) };
}

/** The objects a group's members come from: its folder's, then those of the folders beside it and their parent. */
export function nearbyObjects(nodeId: string, getLeaves: (nodeId: string) => DirectoryObject[]): DirectoryObject[] {
  const parentId = getParentId(nodeId);
  const besides = parentId ? getChildren(parentId).filter((o) => o.isContainer && o.id !== nodeId) : [];
  return [nodeId, ...besides.map((o) => o.id), ...(parentId ? [parentId] : [])].flatMap(getLeaves);
}

/** `count` entries of `list` in a row from a start picked by `seed`, without repeats. */
function run<T>(list: T[], count: number, seed: number): T[] {
  const n = Math.min(count, list.length);
  const start = list.length ? seed % list.length : 0;
  return Array.from({ length: n }, (_, i) => list[(start + i) % list.length]);
}

/** The members a group starts with: as many as its member count, in the Overview's mix, groups first. */
function startingMembers(group: DirectoryObject, pool: DirectoryObject[]): DirectoryObject[] {
  const want = memberMix(group.details.memberCount ?? 0);
  const seed = hash(group.id);
  return ORDER.flatMap((kind) =>
    run(
      pool.filter((o) => o.id !== group.id && kindOf(o) === kind),
      want[kind],
      seed,
    ),
  );
}

/** A group's members: its starting members and the ones added on the Memberships tab, less the ones removed. */
export function groupMembers(
  group: DirectoryObject,
  pool: DirectoryObject[],
  props: Pick<GroupProps, 'addedMembers' | 'removedMembers'>,
): DirectoryObject[] {
  const start = startingMembers(group, pool);
  const have = new Set(start.map((o) => o.id));
  const added = props.addedMembers
    .filter((id) => !have.has(id))
    .map((id) => pool.find((o) => o.id === id))
    .filter((o): o is DirectoryObject => Boolean(o));
  const removed = new Set(props.removedMembers);
  return [...start, ...added].filter((o) => !removed.has(o.id));
}

/** The groups a group is a member of: three from nearby that aren't its members, less the ones it was taken out of. */
export function groupMemberOf(
  group: DirectoryObject,
  pool: DirectoryObject[],
  members: DirectoryObject[],
  props: Pick<GroupProps, 'leftGroups'>,
): DirectoryObject[] {
  const skip = new Set([group.id, ...startingMembers(group, pool).map((o) => o.id), ...members.map((o) => o.id)]);
  const left = new Set(props.leftGroups);
  return run(
    pool.filter((o) => o.type === 'group' && !skip.has(o.id)),
    3,
    hash(`${group.id}:of`),
  ).filter((o) => !left.has(o.id));
}

/** The Overview's member counts, from the members themselves. */
export function memberTotals(members: DirectoryObject[]): Record<Kind, number> & { total: number } {
  const count = (kind: Kind) => members.filter((o) => kindOf(o) === kind).length;
  return { total: members.length, users: count('users'), groups: count('groups'), devices: count('devices'), others: count('others') };
}
