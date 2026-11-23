import { useState } from 'react';
import type { ARSColumnSettings } from '@ars';
import type { FilterFieldDef } from '../../lib/advancedFilter.js';
import type { SortColumn } from './useColumnSort.js';

/** A column the table settings menu offers: one of the list's properties, shown as text. */
export interface ExtraColumn<T> {
  label: string;
  /** What the item holds; several values (tags) show comma-separated. */
  value: (item: T) => string | string[];
  /** The value is a `YYYY-MM-DD` date, shown as the lists draw dates ("10/24/23"). */
  date?: boolean;
  /** The value is an ISO date and time, shown as "10/24/23, 9:41 AM". */
  dateTime?: boolean;
}

/** The column, hidden at first, for when an object arrived in its current folder; moving objects there lets a mistaken move be reversed by hand. */
export const ADDED_TO_LOCATION = 'When added here';

export interface ColumnSettings<T> {
  /** For the table's `columnSettings` prop. */
  settings: ARSColumnSettings;
  /** An item's text for the added columns that show, for its row's `extra`. */
  extraFor: (item: T) => Record<string, string>;
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });

const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' });

function asText<T>(column: ExtraColumn<T>, item: T): string {
  const value = column.value(item);
  if (Array.isArray(value)) return value.join(', ');
  if (column.date && value) return dateFormat.format(new Date(`${value}T00:00:00`));
  if (column.dateTime && value) return dateTimeFormat.format(new Date(value));
  return value;
}

/** The list's filter fields that no column shows, as columns to add: anything the list filters by can show. */
export function fieldColumns<T>(fields: FilterFieldDef<T>[], columns: SortColumn<T>[]): ExtraColumn<T>[] {
  return fields
    .filter((f) => !columns.some((c) => c.field === f.id || c.label === f.label))
    .map((f) => ({ label: f.label, value: f.get, date: f.date }));
}

/**
 * The right-most column head's table settings menu for a list, as the designer asked: Edit width (off at first) lets
 * the column edges be dragged, and the menu shows, hides and reorders the list's columns and `extras`. Kept while the
 * page is open.
 */
export function useColumnSettings<T>(extras: ExtraColumn<T>[]): ColumnSettings<T> {
  const [hidden, setHidden] = useState<string[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const [editWidth, setEditWidth] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [widths, setWidths] = useState<Record<string, number>>({});

  const labels = extras.map((c) => c.label);
  const toggle = (list: string[], column: string, on: boolean) => (on ? [...list, column] : list.filter((l) => l !== column));
  const settings: ARSColumnSettings = {
    extra: labels,
    hidden,
    added,
    onToggleColumn: (column, shown) => {
      if (labels.includes(column)) setAdded((list) => toggle(list, column, shown));
      else setHidden((list) => toggle(list, column, !shown));
    },
    editWidth,
    onEditWidthChange: setEditWidth,
    order,
    onReorder: setOrder,
    widths,
    onWidthChange: (column, width) => setWidths((current) => ({ ...current, [column]: width })),
  };

  const shown = extras.filter((c) => added.includes(c.label));
  const extraFor = (item: T) => Object.fromEntries(shown.map((c) => [c.label, asText(c, item)]));
  return { settings, extraFor };
}
