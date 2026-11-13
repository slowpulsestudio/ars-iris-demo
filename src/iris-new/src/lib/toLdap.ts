import { operatorTakesValue, type Condition, type FilterNode, type Group } from '@iris/components/Filters/filterModel.js';

/** The LDAP attribute behind each parameter id; an id with none is written as it is. */
export type LdapAttributes = Record<string, string>;

/** `2026-05-01` as LDAP generalized time; anything else as it is. */
const ldapValue = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v.replace(/-/g, '')}000000.0Z` : v);

/** Escapes the characters LDAP filters reserve (RFC 4515), keeping `*` when it is meant as a wildcard. */
function escape(v: string, keepWildcards = false): string {
  return ldapValue(v).replace(keepWildcards ? /[()\\\0]/g : /[*()\\\0]/g, (c) => `\\${c.charCodeAt(0).toString(16).padStart(2, '0')}`);
}

const anyOf = (parts: string[]) => (parts.length === 1 ? parts[0] : `(|${parts.join('')})`);

function conditionFilter(c: Condition, attrs: LdapAttributes): string | null {
  if (!c.parameterId || !c.operatorId) return null;
  const a = attrs[c.parameterId] ?? c.parameterId.replace(/\s+/g, '');
  if (!operatorTakesValue(c.operatorId)) return `(!(${a}=*))`;
  const values = c.values.filter((v) => v !== '');
  if (values.length === 0) return null;
  const each = (f: (v: string) => string) => anyOf(values.map(f));
  switch (c.operatorId) {
    case 'eq':
    case 'in':
      return each((v) => `(${a}=${escape(v)})`);
    case 'neq':
    case 'nin':
      return `(!${each((v) => `(${a}=${escape(v)})`)})`;
    case 'gte':
      return each((v) => `(${a}>=${escape(v)})`);
    case 'lte':
      return each((v) => `(${a}<=${escape(v)})`);
    case 'gt':
      return each((v) => `(&(${a}>=${escape(v)})(!(${a}=${escape(v)})))`);
    case 'lt':
      return each((v) => `(&(${a}<=${escape(v)})(!(${a}=${escape(v)})))`);
    case 'between':
      return values.length < 2 ? null : `(&(${a}>=${escape(values[0])})(${a}<=${escape(values[1])}))`;
    case 'contains':
      return each((v) => `(${a}=*${escape(v)}*)`);
    case 'ncontains':
      return `(!${each((v) => `(${a}=*${escape(v)}*)`)})`;
    case 'matches':
      return each((v) => `(${a}~=${escape(v)})`);
    case 'wildcard':
      return each((v) => `(${a}=${escape(v, true)})`);
    default:
      return null;
  }
}

function nodeFilter(node: FilterNode, attrs: LdapAttributes, indent: string): string | null {
  if (node.kind === 'condition') {
    const f = conditionFilter(node, attrs);
    return f && `${indent}${f}`;
  }
  const inner = node.children.map((c) => nodeFilter(c, attrs, `${indent}  `)).filter((s): s is string => s !== null);
  if (inner.length === 0) return null;
  if (inner.length === 1) return `${indent}${inner[0].trimStart()}`;
  return `${indent}(${node.op === 'and' ? '&' : '|'}\n${inner.join('\n')}\n${indent})`;
}

/**
 * The filter as an LDAP query (RFC 4515), indented as the Query syntax view draws it (Figma ARS_WebUI2_Advanced-Search
 * "Query" 4113:92324). Unfinished conditions are left out; an empty filter matches every object.
 */
export function toLdap(root: Group, attrs: LdapAttributes = {}): string {
  return nodeFilter(root, attrs, '') ?? '(objectClass=*)';
}
