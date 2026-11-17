/** Shared by the group and user Memberships tabs (ARS_Group_Members_Content, ARS_WebUI2_Groups 167:7662). */
import type { ARSGroupTableRow } from '@ars';
import type { SortColumn } from '../ListFilters/useColumnSort.js';

/** Figma draws seven rows a page and no page-size menu (ARS_Group_Object_Memberships table 167:8089, Pagination 2151:9363). */
export const MEMBERSHIPS_PAGE_SIZE = 7;

/** The table's columns sort; the tab has no filter, so their menus only sort. */
export const MEMBERSHIPS_SORT_COLUMNS: SortColumn<ARSGroupTableRow>[] = [
  { label: 'Name', value: (r) => r.name },
  { label: 'Object Type', value: (r) => r.objectType ?? '' },
  { label: 'Description', value: (r) => r.description },
  { label: 'Object ID', value: (r) => r.objectId },
];

/** Figma's search placeholder (167:7972). */
export const MEMBERSHIPS_SEARCH = 'Search all members of ...';

