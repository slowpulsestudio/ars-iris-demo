import type { FilterFieldDef } from '../../lib/advancedFilter.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';

/** The columns of a list of directory objects (Name, Object type, Description) as Advanced filter fields. */
export const DIRECTORY_OBJECT_FIELDS: FilterFieldDef<DirectoryObject>[] = [
  { id: 'Name', label: 'Name', icon: 'IdentificationCard', get: (o) => o.name },
  { id: 'Object type', label: 'Object type', icon: 'Lego', get: (o) => OBJECT_TYPE_META[o.type].label, list: true },
  { id: 'Description', label: 'Description', icon: 'ArticleNyTimes', get: (o) => o.description },
];
