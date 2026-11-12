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

/** The choices for the two date fields: how long ago the date was. */
export const DATE_RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'older', label: 'Older than 90 days' },
];

function inRange(daysAgo: number, range: string): boolean {
  return range === 'older' ? daysAgo > 90 : daysAgo <= Number(range);
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

export function serializeFilters(filters: ActiveFilter[]): string | null {
  if (filters.length === 0) return null;
  return filters.map((f) => `${f.field}~${f.values.map(encodeURIComponent).join('|')}`).join(';');
}

/** Turns a value on or off for a field, keeping the other filters; a field with no values is dropped. */
export function toggleValue(filters: ActiveFilter[], field: FilterField, value: string): ActiveFilter[] {
  const current = filters.find((f) => f.field === field);
  const values = current?.values.includes(value) ? current.values.filter((v) => v !== value) : [...(current?.values ?? []), value];
  return setValues(filters, field, values);
}

export function setValues(filters: ActiveFilter[], field: FilterField, values: string[]): ActiveFilter[] {
  const rest = filters.filter((f) => f.field !== field);
  return values.length ? [...rest, { field, values }].sort((a, b) => FILTER_FIELDS.indexOf(a.field) - FILTER_FIELDS.indexOf(b.field)) : rest;
}

/** Values of one field are alternatives (any may match); different fields must all match. */
export function matchesFilters(row: FilterRow, filters: ActiveFilter[]): boolean {
  return filters.every(({ field, values }) => {
    switch (field) {
      case 'Display name':
        return values.every((v) => row.name.toLowerCase().includes(v.toLowerCase()));
      case 'Object type':
        return values.includes(row.type);
      case 'Tags':
        return row.tags.some((t) => values.includes(t));
      case 'Location':
        return values.includes(row.location);
      case 'Date active':
        return values.some((v) => inRange(row.activeDaysAgo, v));
      case 'Date created':
        return values.some((v) => inRange(row.createdDaysAgo, v));
    }
  });
}

export interface FilterOption {
  value: string;
  label: string;
}

/** The values a field offers, taken from what the list holds. Display name is typed, so it has none. */
export function optionsFor(field: FilterField, rows: FilterRow[]): FilterOption[] {
  if (field === 'Date active' || field === 'Date created') return DATE_RANGES;
  const distinct = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b)).map((v) => ({ value: v, label: v }));
  if (field === 'Object type') return distinct(rows.map((r) => r.type));
  if (field === 'Tags') return distinct(rows.flatMap((r) => r.tags));
  if (field === 'Location') return distinct(rows.map((r) => r.location));
  return [];
}

/** How the pill shows a filter's values: Display name keeps the text, a date range its label. */
export function valueLabel(field: FilterField, value: string): string {
  if (field === 'Date active' || field === 'Date created') return DATE_RANGES.find((r) => r.value === value)?.label ?? value;
  return value;
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
