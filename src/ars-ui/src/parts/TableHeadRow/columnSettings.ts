/**
 * What the right-most column head's menu changes (ARS_Table Menu's Adjust columns and Add columns): which columns
 * show and how wide they are. Columns are named by their labels.
 */
export interface ARSColumnSettings {
  /** Columns "Add columns" offers after the table's own, in the order they show. */
  extra: readonly string[];
  /** The table's own columns that are hidden (never its first). */
  hidden: readonly string[];
  /** The extra columns that show. */
  added: readonly string[];
  /** Shows or hides a column, own or extra. */
  onToggleColumn: (column: string, shown: boolean) => void;
  /** Adjust columns is on: dragging a column head's right edge resizes the column. */
  adjusting: boolean;
  onAdjustingChange: (adjusting: boolean) => void;
  /** Widths the columns were dragged to, in px. */
  widths: Readonly<Record<string, number>>;
  onWidthChange: (column: string, width: number) => void;
}

/** Narrowest a column can be dragged, as on the reference list. */
export const MIN_COLUMN_WIDTH = 80;

/** An added column's width until it is dragged. */
export const EXTRA_COLUMN_WIDTH = 180;

/** The added columns that show, in the order they show. */
export function shownExtras(settings: ARSColumnSettings): string[] {
  return settings.extra.filter((label) => settings.added.includes(label));
}
