import type { FilterFieldDef } from '../../lib/advancedFilter.js';

/** A sample group or role: the shape the Memberships and Roles tabs list. */
export interface NamedObject {
  id: string;
  name: string;
  description: string;
  objectId: string;
}

/** The columns of the Memberships and Roles tabs as Advanced filter fields. */
export const NAMED_OBJECT_FIELDS: FilterFieldDef<NamedObject>[] = [
  { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (o) => o.name },
  { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (o) => o.description },
  { id: 'Object ID', label: 'Object ID', icon: 'Hash', get: (o) => o.objectId },
];
