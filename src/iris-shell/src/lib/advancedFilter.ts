import {
  isConditionComplete,
  newCondition,
  newGroup,
  operatorTakesValue,
  type Condition,
  type FilterNode,
  type Group,
  type ParameterDef,
} from '../components/Filters/filterModel.js';
import type { ParamCategory } from '../components/Filters/AdvancedFilter.js';
import { parseFilters, type FilterRow } from './listFilters.js';

/**
 * The property groups of the "Add filter" menu, in Figma's order and with Figma's icons
 * (ARS_WebUI2_Advanced-Search "Add filter dropdown" 4145:57189).
 */
export const FILTER_CATEGORIES = [
  { label: 'Common', icon: 'IdentificationCard' },
  { label: 'User', icon: 'DiamondsFour' },
  { label: 'Computer', icon: 'MapPinSimpleArea' },
  { label: 'Groups', icon: 'CalendarDots' },
  { label: 'Other properties' },
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number]['label'];

/** One field a list can be filtered by: what the Panel and Bar offer as a parameter. */
export interface FilterFieldDef<T> {
  id: string;
  label: string;
  icon?: string;
  /** What an item holds for this field: one value, or several (tags). Dates are `YYYY-MM-DD`. */
  get: (item: T) => string | string[];
  /** Offer the distinct values in the list as the value picker (object type, tags, location). */
  list?: boolean;
  date?: boolean;
  /** The "Add filter" menu group it is listed under. Defaults to Common. */
  category?: FilterCategory;
}

/** The "Add filter" menu groups for these fields: Figma's groups in order, each listed when it has a field. */
export function categoriesFor<T>(fields: FilterFieldDef<T>[]): ParamCategory[] {
  return FILTER_CATEGORIES.map((c) => ({
    label: c.label,
    icon: 'icon' in c ? c.icon : undefined,
    parameterIds: fields.filter((f) => (f.category ?? 'Common') === c.label).map((f) => f.id),
  })).filter((c) => c.parameterIds.length > 0);
}

/** Where the empty Panel's "Read the filters guide" goes: the filter guidance linked from the Iris UI Kit notes (9747:14118). */
export const FILTERS_GUIDE_URL = 'https://qsft.atlassian.net/wiki/x/h4BX6';

/** The AD attribute each field is written as in the Panel's Query syntax view. Tags have no AD attribute; extensionAttribute1 stands in. */
export const LDAP_ATTRIBUTES: Record<string, string> = {
  'Display name': 'displayName',
  Name: 'name',
  'Object type': 'objectClass',
  Type: 'objectClass',
  Tags: 'extensionAttribute1',
  Location: 'distinguishedName',
  Directory: 'distinguishedName',
  'Date active': 'lastLogonTimestamp',
  'Date created': 'whenCreated',
  Description: 'description',
  Email: 'mail',
  Status: 'userAccountControl',
  'Group type': 'groupType',
  'Object ID': 'objectGUID',
};

const asList = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]);

/** The date `daysAgo` days before today, as `YYYY-MM-DD`. */
export function isoDaysAgo(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
}

/** The six fields of Figma's Filters menu, for a list that can describe an item as a `FilterRow`. */
export function rowFields<T>(toRow: (item: T) => FilterRow): FilterFieldDef<T>[] {
  return [
    { id: 'Display name', label: 'Display name', icon: 'IdentificationCard', get: (i) => toRow(i).name },
    { id: 'Object type', label: 'Object type', icon: 'Lego', get: (i) => toRow(i).type, list: true },
    { id: 'Tags', label: 'Tags', icon: 'Tag', get: (i) => toRow(i).tags, list: true },
    { id: 'Location', label: 'Location', icon: 'MapPin', get: (i) => toRow(i).location, list: true },
    { id: 'Date active', label: 'Date active', icon: 'CalendarDots', get: (i) => isoDaysAgo(toRow(i).activeDaysAgo), date: true },
    { id: 'Date created', label: 'Date created', icon: 'CalendarDots', get: (i) => isoDaysAgo(toRow(i).createdDaysAgo), date: true },
  ];
}

/** The Panel's and Bar's parameters for these fields; list fields offer the values the items hold. */
export function parametersFor<T>(fields: FilterFieldDef<T>[], items: T[]): ParameterDef[] {
  return fields.map((f) => {
    const options = f.list
      ? [...new Set(items.flatMap((i) => asList(f.get(i))).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b))
          .map((v) => ({ value: v, label: v }))
      : undefined;
    return { id: f.id, label: f.label, icon: f.icon, options, date: f.date };
  });
}

function compare(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (a.trim() !== '' && b.trim() !== '' && Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function wildcardTest(pattern: string, text: string): boolean {
  const source = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${source}$`, 'i').test(text);
}

function patternTest(pattern: string, text: string): boolean {
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch {
    return text.toLowerCase().includes(pattern.toLowerCase());
  }
}

/** Whether the values an item holds satisfy one complete condition. Several values are alternatives. */
function conditionHolds(condition: Condition, held: string[]): boolean {
  const { operatorId, values } = condition;
  const lower = (s: string) => s.toLowerCase();
  const any = (test: (a: string, v: string) => boolean) => held.some((a) => values.some((v) => test(a, v)));
  switch (operatorId) {
    case 'empty':
      return held.every((a) => a.trim() === '');
    case 'eq':
    case 'in':
      return any((a, v) => lower(a) === lower(v));
    case 'neq':
    case 'nin':
      return !any((a, v) => lower(a) === lower(v));
    case 'lt':
      return any((a, v) => compare(a, v) < 0);
    case 'lte':
      return any((a, v) => compare(a, v) <= 0);
    case 'gt':
      return any((a, v) => compare(a, v) > 0);
    case 'gte':
      return any((a, v) => compare(a, v) >= 0);
    case 'between':
      return held.some((a) => compare(a, values[0]) >= 0 && compare(a, values[1]) <= 0);
    case 'contains':
      return any((a, v) => lower(a).includes(lower(v)));
    case 'ncontains':
      return !any((a, v) => lower(a).includes(lower(v)));
    case 'matches':
      return any((a, v) => patternTest(v, a));
    case 'wildcard':
      return any((a, v) => wildcardTest(v, a));
    default:
      return true;
  }
}

/** The conditions in a tree that can filter (parameter, operator and value all set). */
export function completeConditions(node: FilterNode): Condition[] {
  if (node.kind === 'condition') return isConditionComplete(node) ? [node] : [];
  return node.children.flatMap(completeConditions);
}

/**
 * Whether an item passes the tree. A condition that is not finished yet is left out, and a group
 * with nothing finished in it passes everything, so a half-built filter never empties the list.
 */
export function matchesTree<T>(node: FilterNode, item: T, fields: FilterFieldDef<T>[]): boolean {
  if (node.kind === 'condition') {
    const field = fields.find((f) => f.id === node.parameterId);
    return !field || conditionHolds(node, asList(field.get(item)));
  }
  const active = node.children.filter((c) => completeConditions(c).length > 0);
  if (active.length === 0) return true;
  return node.op === 'and' ? active.every((c) => matchesTree(c, item, fields)) : active.some((c) => matchesTree(c, item, fields));
}

/** The URL form of an applied filter (`?filter=`): the tree as JSON, or none when nothing is set. */
export function serializeApplied(root: Group): string | null {
  return completeConditions(root).length === 0 ? null : JSON.stringify(root);
}

const DAYS = { '7': 7, '30': 30, '90': 90 } as const;

/** Old links (`?filter=Tags~Security|Helpdesk;Location~Entra`) as one card of conditions. */
function fromLegacy(param: string): Group {
  const conditions = parseFilters(param).flatMap<Condition>(({ field, values }) => {
    if (field === 'Display name') {
      return values.map((v) => newCondition({ parameterId: field, operatorId: 'contains', values: [v] }));
    }
    if (field === 'Date active' || field === 'Date created') {
      return values.map((v) =>
        v === 'older'
          ? newCondition({ parameterId: field, operatorId: 'lt', values: [isoDaysAgo(90)] })
          : newCondition({ parameterId: field, operatorId: 'gte', values: [isoDaysAgo(DAYS[v as keyof typeof DAYS] ?? 7)] }),
      );
    }
    return [newCondition({ parameterId: field, operatorId: 'in', values })];
  });
  return newGroup('and', conditions.length ? [newGroup('and', conditions)] : []);
}

/** Reads `?filter=`: the JSON the Panel writes, or the older field~value form. */
export function parseApplied(param: string | null): Group {
  if (!param) return newGroup('and');
  if (param.startsWith('{')) {
    try {
      const tree = JSON.parse(param) as Group;
      if (tree.kind === 'group') return withFreshIds(tree);
    } catch {
      return newGroup('and');
    }
  }
  return fromLegacy(param);
}

/** New ids all through a tree read back from the address, so they never collide with ones made since. */
function withFreshIds(node: Group): Group;
function withFreshIds(node: FilterNode): FilterNode;
function withFreshIds(node: FilterNode): FilterNode {
  if (node.kind === 'condition') return { ...node, id: newCondition().id };
  return { ...newGroup(node.op), children: node.children.map(withFreshIds) };
}

/** Whether a condition takes a value, re-exported so callers need one import for filter logic. */
export { operatorTakesValue };
