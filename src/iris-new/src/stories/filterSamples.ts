import {
  newCondition,
  newGroup,
  type Group,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { QuerySyntaxOption } from '../components/QuerySyntax/QuerySyntax.js';
import { toLdap } from '../lib/toLdap.js';

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

export function syntaxesFor(root: Group): QuerySyntaxOption[] {
  return [{ id: 'ldap', label: 'LDAP', code: toLdap(root, LDAP_ATTR) }];
}
