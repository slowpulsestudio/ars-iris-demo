import { hash } from './sampleData.js';

/** The fields in Figma's Filters menu (ARS_Filter_Menu, 3064:26920), in its order. */
export const FILTER_FIELDS = ['Display name', 'Object type', 'Tags', 'Location', 'Date active', 'Date created'] as const;
export type FilterField = (typeof FILTER_FIELDS)[number];

/** One applied filter. Display name holds the text typed; the others hold the ticked values. */
export interface ActiveFilter {
  field: FilterField;
  values: string[];
}

/** What a list says about one of its items, so every list can be filtered the same way. */
export interface FilterRow {
  name: string;
  type: string;
  tags: string[];
  location: string;
  activeDaysAgo: number;
  createdDaysAgo: number;
}

const FIELD_SET = new Set<string>(FILTER_FIELDS);

/** Reads `?filter=Tags~Security|Helpdesk;Location~Entra` (each value URI-encoded). */
export function parseFilters(param: string | null): ActiveFilter[] {
  if (!param) return [];
  return param.split(';').flatMap((part) => {
    const [field, rest = ''] = part.split('~');
    if (!FIELD_SET.has(field)) return [];
    const values = rest ? rest.split('|').map(decodeURIComponent) : [];
    return values.length ? [{ field: field as FilterField, values }] : [];
  });
}

/** Sample dates for lists that have none: fixed for a given id, spread over the last two years. */
export function sampleDates(id: string): Pick<FilterRow, 'activeDaysAgo' | 'createdDaysAgo'> {
  const h = hash(id);
  return { activeDaysAgo: h % 150, createdDaysAgo: 30 + ((h >>> 3) % 700) };
}

const SAMPLE_TAGS = ['Security', 'Compliance', 'Finance', 'HR', 'Engineering', 'Helpdesk', 'Marketing', 'Operations', 'Platform', 'Sales'];

/** Sample tags for lists that have none: two, fixed for a given id. */
export function sampleTags(id: string): string[] {
  const h = hash(id);
  const first = h % SAMPLE_TAGS.length;
  const second = (first + 1 + ((h >>> 4) % (SAMPLE_TAGS.length - 1))) % SAMPLE_TAGS.length;
  return [SAMPLE_TAGS[first], SAMPLE_TAGS[second]];
}
