/**
 * What the right-most column head's table settings menu changes: which columns show, in what order, and how wide
 * they are. Columns are named by their labels.
 */
export interface ARSColumnSettings {
  /** Columns the menu offers after the table's own (the list's other properties). */
  extra: readonly string[];
  /** The table's own columns that are hidden (never its first). */
  hidden: readonly string[];
  /** The extra columns that show. */
  added: readonly string[];
  /** Shows or hides a column, own or extra. */
  onToggleColumn: (column: string, shown: boolean) => void;
  /** Edit width is on: the column edges can be dragged. Off by default. */
  editWidth: boolean;
  onEditWidthChange: (on: boolean) => void;
  /** The order the columns were dragged into; columns not in it follow in their own order. */
  order: readonly string[];
  onReorder: (order: string[]) => void;
  /** Widths the columns were dragged to, in px. */
  widths: Readonly<Record<string, number>>;
  onWidthChange: (column: string, width: number) => void;
}

/** Narrowest a column can be dragged, as on the reference list. */
export const MIN_COLUMN_WIDTH = 80;

/** An added column's width until it is dragged. */
export const EXTRA_COLUMN_WIDTH = 180;

/** The added columns that show, in the order their cells are rendered. */
export function shownExtras(settings: ARSColumnSettings): string[] {
  return settings.extra.filter((label) => settings.added.includes(label));
}

/** Every column, own and extra, in the order they show: the table's first column, which never moves, then the rest. */
export function columnOrder(own: readonly string[], settings: ARSColumnSettings): string[] {
  const rest = [...own.slice(1), ...settings.extra];
  const placed = settings.order.filter((label) => rest.includes(label));
  return [own[0], ...placed, ...rest.filter((label) => !placed.includes(label))];
}
