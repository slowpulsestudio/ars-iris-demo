import { Fragment, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { TableHeadItem } from '@iris/components/TableHeadItem/TableHeadItem.js';
import { ARSSortableHeaderCell, type ARSColumnSorting } from '../../components/ARSSortableHeaderCell/ARSSortableHeaderCell.js';
import { ColumnSettingsMenu } from './ColumnSettingsMenu.js';
import { EXTRA_COLUMN_WIDTH, MIN_COLUMN_WIDTH, columnOrder, shownExtras, type ARSColumnSettings } from './columnSettings.js';
import styles from './TableHeadRow.module.css';

export interface TableHeadColumn {
  /** Omit for a text-only heading, as in ARS_Group_Table. */
  icon?: string;
  label: string;
  /** Width from Figma; omit to fill. */
  width?: number;
  /** Extra item placed right after this column in the row. */
  trailing?: ReactNode;
}

export interface TableHeadRowProps {
  columns: TableHeadColumn[];
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  /** Content of the last head cell, e.g. a column-settings button. */
  actions?: ReactNode;
  /** Width of the last head cell in px (default 44); 0 leaves the cell out, for tables without an action column. */
  actionsWidth?: number;
  /** Makes the listed columns' heads sort and filter (IM / Sortable header cell). */
  sorting?: ARSColumnSorting;
  /**
   * The right-most head's table settings menu (the columns to show, in the order they show) and what it changes;
   * replaces `actions`. The columns are resizable.
   */
  columnSettings?: ARSColumnSettings;
  className?: string;
}

/**
 * The user's column choices as rules for the head and every row of the table, by position: rows are flex rows whose
 * cells follow the head's order (select, the columns, the added columns, actions), so no row has to know them. The
 * columns show in the user's order through `order`, and `elastic` stretches to fill the row, so no gap opens;
 * `!important` where a rule must beat the Figma widths the heads set inline.
 */
function columnRules(
  scope: string,
  own: string[],
  extras: string[],
  settings: ARSColumnSettings,
  widthOf: (column: string) => number | undefined,
  elastic: string,
): string {
  const row = `[role='table']:has([data-ars-columns='${scope}']) [role='row'] >`;
  const rule = (n: number, declarations: string) => `${row} :nth-child(${n}) { ${declarations} }`;
  const order = columnOrder(own, settings);
  const sized = (label: string, width: number | undefined) => {
    const place = `order: ${order.indexOf(label) + 1};`;
    if (label === elastic) {
      return `${place} flex: 1 1 0 !important; width: auto !important; min-width: ${MIN_COLUMN_WIDTH}px !important;`;
    }
    return width == null ? place : `${place} flex: none !important; width: ${width}px !important;`;
  };
  const rules = own.map((label, i) =>
    i > 0 && settings.hidden.includes(label) ? rule(i + 2, 'display: none !important;') : rule(i + 2, sized(label, widthOf(label))),
  );
  extras.forEach((label, i) => {
    rules.push(rule(own.length + i + 2, sized(label, widthOf(label) ?? EXTRA_COLUMN_WIDTH)));
  });
  // The action column comes last, at the right edge.
  rules.push(rule(own.length + extras.length + 2, `order: ${order.length + 1}; margin-left: auto;`));
  return rules.join('\n');
}

/** The edge between a column and the next one it shows beside, with both widths when the drag started. */
interface Edge {
  column: string;
  next: string;
  from: number;
  nextFrom: number;
}

/** Head row shared by the ARS table heads: select-all, labelled columns, action column. */
export function TableHeadRow({
  columns,
  allSelected = false,
  someSelected = false,
  onSelectAll,
  actions,
  actionsWidth,
  sorting,
  columnSettings,
  className,
}: TableHeadRowProps) {
  const scope = useId().replace(/[^\w-]/g, '');
  const rowRef = useRef<HTMLDivElement | null>(null);
  // The widths being dragged: only the head re-renders while dragging; the rows follow through the rules.
  const [drag, setDrag] = useState<{ column: string; widths: Record<string, number> } | null>(null);
  const own = columns.map((c) => c.label);
  const extras = columnSettings ? shownExtras(columnSettings) : [];
  const widthOf = (column: string) => drag?.widths[column] ?? columnSettings?.widths[column];
  // The columns that show, in their order, and the one that stretches to fill the row: the table's fill column, or
  // the last column while that one is hidden.
  const shown = columnSettings
    ? columnOrder(own, columnSettings).filter((label) =>
        own.includes(label) ? label === own[0] || !columnSettings.hidden.includes(label) : extras.includes(label),
      )
    : own;
  const fill = columns.find((c) => c.width == null)?.label;
  const elastic = fill && shown.includes(fill) ? fill : shown[shown.length - 1];

  // A column's head cell, counted as the rules count the row's cells (after the select cell).
  const widthNow = (label: string) => {
    const i = own.indexOf(label);
    const cell = rowRef.current?.children[i >= 0 ? i + 1 : own.length + extras.indexOf(label) + 1];
    return Math.round(cell?.getBoundingClientRect().width ?? 0);
  };
  const edgeOf = (column: string): Edge | null => {
    const next = shown[shown.indexOf(column) + 1];
    return next ? { column, next, from: widthNow(column), nextFrom: widthNow(next) } : null;
  };
  // Moving an edge by `d` grows the column on one side by what the other loses, neither under the minimum, so the row
  // keeps its width and no gap opens. The elastic column takes its share by itself.
  const resized = ({ column, next, from, nextFrom }: Edge, d: number) => {
    const by = Math.round(Math.max(MIN_COLUMN_WIDTH - from, Math.min(nextFrom - MIN_COLUMN_WIDTH, d)));
    const widths: Record<string, number> = {};
    if (column !== elastic) widths[column] = from + by;
    if (next !== elastic) widths[next] = nextFrom - by;
    return widths;
  };
  const commit = (widths: Record<string, number>) => {
    for (const [column, width] of Object.entries(widths)) columnSettings?.onWidthChange(column, width);
  };

  const startDrag = (column: string, e: PointerEvent<HTMLElement>) => {
    const edge = edgeOf(column);
    if (e.button !== 0 || !edge) return;
    e.preventDefault();
    const handle = e.currentTarget;
    const x0 = e.clientX;
    let widths: Record<string, number> = {};
    const page = { cursor: document.body.style.cursor, userSelect: document.body.style.userSelect };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    handle.setPointerCapture(e.pointerId);
    const move = (ev: globalThis.PointerEvent) => {
      widths = resized(edge, ev.clientX - x0);
      setDrag({ column, widths });
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      Object.assign(document.body.style, page);
      setDrag(null);
      commit(widths);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };

  // The keyboard way to resize: Left and Right arrows, 8px a press (40px with Shift).
  const nudge = (column: string, e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const edge = edgeOf(column);
    if (edge) commit(resized(edge, (e.shiftKey ? 40 : 8) * (e.key === 'ArrowLeft' ? -1 : 1)));
  };

  const head = (col: { label: string; icon?: string }, size: { style?: CSSProperties; className?: string }) => {
    const className = cx(size.className, columnSettings && styles.resizable);
    // Every edge between two columns moves; the last column's right edge stays at the action column.
    const handle: ReactNode = columnSettings && shown.indexOf(col.label) < shown.length - 1 && (
      <span
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${col.label} column`}
        tabIndex={0}
        className={cx(styles.resizeHandle, drag?.column === col.label && styles.resizing)}
        onPointerDown={(e) => startDrag(col.label, e)}
        onKeyDown={(e) => nudge(col.label, e)}
      />
    );
    return sorting?.sortable.includes(col.label) ? (
      <ARSSortableHeaderCell
        icon={col.icon}
        label={col.label}
        sort={sorting.sortedBy?.column === col.label ? sorting.sortedBy.direction : undefined}
        filtered={sorting.filtered?.includes(col.label)}
        onSort={(direction) => sorting.onSort(col.label, direction)}
        filter={sorting.filters?.[col.label]}
        className={className}
        style={size.style}
      >
        {handle}
      </ARSSortableHeaderCell>
    ) : (
      <TableHeadItem icon={col.icon} label={col.label} className={className} style={size.style}>
        {handle}
      </TableHeadItem>
    );
  };

  return (
    <>
      {columnSettings && <style>{columnRules(scope, own, extras, columnSettings, widthOf, elastic)}</style>}
      <div
        ref={rowRef}
        role="row"
        data-ars-columns={columnSettings ? scope : undefined}
        className={cx(styles.head, className)}
      >
        <TableHeadItem inset="s" className={styles.check}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={onSelectAll}
            ariaLabel="Select all"
          />
        </TableHeadItem>
        {columns.map((col) => (
          <Fragment key={col.label}>
            {head(col, {
              style: col.width != null ? { width: col.width } : undefined,
              className: col.width == null ? styles.fill : undefined,
            })}
            {col.trailing}
          </Fragment>
        ))}
        {extras.map((label) => (
          <Fragment key={label}>{head({ label }, { className: styles.extraCell })}</Fragment>
        ))}
        {actionsWidth !== 0 && (
          <TableHeadItem
            className={styles.actions}
            style={actionsWidth != null ? { width: actionsWidth } : undefined}
            aria-label="Actions"
          >
            {columnSettings ? <ColumnSettingsMenu own={own} settings={columnSettings} /> : actions}
          </TableHeadItem>
        )}
      </div>
    </>
  );
}
