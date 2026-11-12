import {
  newCondition,
  newGroup,
  operatorTakesValue,
  type FilterNode,
  type Group,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { QuerySyntaxOption } from '../components/QuerySyntax/QuerySyntax.js';

/** Parameters named as in the Iris UI Kit filter frames. */
export const PARAMETERS: ParameterDef[] = [
  { id: 'displayName', label: 'Display name', icon: 'IdentificationCard' },
  {
    id: 'objectType',
    label: 'Object type',
    icon: 'Lego',
    options: [
      { value: 'user', label: 'User' },
      { value: 'computer', label: 'Computer' },
      { value: 'group', label: 'Group' },
    ],
  },
  { id: 'tags', label: 'Tags', icon: 'Tag' },
  { id: 'memberOf', label: 'Member of', icon: 'Lego' },
  { id: 'created', label: 'Created date', icon: 'CalendarDots', date: true },
  { id: 'location', label: 'Location', icon: 'MapPin' },
];

/** The "+ Filter" menu groups in the Figma: Common, User, Computer, Groups. */
export const CATEGORIES: ParamCategory[] = [
  { label: 'Common', icon: 'IdentificationCard', parameterIds: ['displayName', 'objectType', 'tags'] },
  { label: 'User', icon: 'DiamondsFour', parameterIds: ['memberOf', 'location'] },
  { label: 'Computer', icon: 'MapPin', parameterIds: ['location'] },
  { label: 'Groups', icon: 'CalendarDots', parameterIds: ['created'] },
];

/** A blank rule card, as "+ Filter" adds it. */
export const blankFilter = (): Group => newGroup('and', []);

/** One card with one condition ("default, set to AND"). */
export const singleCardFilter = (): Group => newGroup('and', [newGroup('and', [newCondition()])]);

/** The same, set to OR ("Where any conditions are met"). */
export const orFilter = (): Group =>
  newGroup('or', [
    newGroup('and', [newCondition({ parameterId: 'displayName', operatorId: 'eq' })]),
  ]);

/** Cards with a nested group three levels deep ("Nesting, interactions"). */
export const nestedFilter = (): Group =>
  newGroup('and', [
    newGroup('and', [
      newCondition({ parameterId: 'created', operatorId: 'gte', values: ['2026-08-01'] }),
      newGroup('or', [
        newCondition({ parameterId: 'displayName', operatorId: 'contains', values: ['svc-'] }),
        newCondition({ parameterId: 'tags', operatorId: 'contains', values: ['Dataset'] }),
        newGroup('or', [newCondition({ parameterId: 'location', operatorId: 'eq', values: ['OU1'] })]),
      ]),
    ]),
    newGroup('and', [newCondition()]),
  ]);

/** The pills in the Figma Content header. */
export const barFilter = (): Group =>
  newGroup('and', [
    newGroup('and', [
      newCondition({ parameterId: 'objectType', operatorId: 'contains', values: ['user'] }),
      newCondition({ parameterId: 'tags', operatorId: 'eq', values: ['HR'] }),
      newCondition({ parameterId: 'tags', operatorId: 'eq', values: ['Finance'] }),
      newCondition({ parameterId: 'tags', operatorId: 'eq', values: ['Legal'] }),
    ]),
    newGroup('and', [newCondition({ parameterId: 'tags', operatorId: 'ncontains', values: ['Dataset'] })]),
    newGroup('or', [
      newCondition({ parameterId: 'memberOf', operatorId: 'matches', values: ['Support team'] }),
      newCondition({ parameterId: 'memberOf', operatorId: 'matches', values: ['Sales'] }),
      newCondition({ parameterId: 'memberOf', operatorId: 'matches', values: ['IT'] }),
    ]),
    newGroup('and', [newCondition({ parameterId: 'created', operatorId: 'gte', values: ['2026-09-21'] })]),
  ]);

const LDAP_ATTR: Record<string, string> = {
  displayName: 'displayName',
  objectType: 'objectClass',
  tags: 'description',
  memberOf: 'memberOf',
  created: 'whenCreated',
  location: 'distinguishedName',
};

const LDAP_OP: Record<string, (attr: string, v: string) => string> = {
  eq: (a, v) => `(${a}=${v})`,
  neq: (a, v) => `(!(${a}=${v}))`,
  gt: (a, v) => `(${a}>${v})`,
  gte: (a, v) => `(${a}>=${v})`,
  lt: (a, v) => `(${a}<${v})`,
  lte: (a, v) => `(${a}<=${v})`,
  contains: (a, v) => `(${a}=*${v}*)`,
  ncontains: (a, v) => `(!(${a}=*${v}*))`,
  matches: (a, v) => `(${a}~=${v})`,
  wildcard: (a, v) => `(${a}=${v}*)`,
  in: (a, v) => `(${a}=${v})`,
  nin: (a, v) => `(!(${a}=${v}))`,
};

function ldapNode(node: FilterNode, indent: string): string | null {
  if (node.kind === 'condition') {
    if (!node.parameterId || !node.operatorId) return null;
    const attr = LDAP_ATTR[node.parameterId] ?? node.parameterId;
    if (!operatorTakesValue(node.operatorId)) return `${indent}(${attr}=*)`;
    const parts = node.values.map((v) => LDAP_OP[node.operatorId!](attr, v));
    if (parts.length === 0) return null;
    return parts.length === 1 ? `${indent}${parts[0]}` : `${indent}(|${parts.join('')})`;
  }
  const inner = node.children.map((c) => ldapNode(c, `${indent}  `)).filter((s): s is string => s !== null);
  if (inner.length === 0) return null;
  if (inner.length === 1) return inner[0];
  return `${indent}(${node.op === 'and' ? '&' : '|'}\n${inner.join('\n')}\n${indent})`;
}

/** A rough LDAP rendering of the tree, enough to show the Query syntax view. */
export function toLdap(root: Group): string {
  return ldapNode(root, '') ?? '';
}

export function syntaxesFor(root: Group): QuerySyntaxOption[] {
  return [{ id: 'ldap', label: 'LDAP', code: toLdap(root) || '(objectClass=*)' }];
}
