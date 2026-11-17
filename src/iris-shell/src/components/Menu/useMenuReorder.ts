import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import type { MenuEntry } from './Menu.js';

const isMovable = (item: MenuEntry | undefined) => item?.kind === 'checkbox' && !!item.movable;

/** The movable entries next to each other that entry `i` is one of, as first and last index. */
function runOf(items: MenuEntry[], i: number): [number, number] {
  let first = i;
  while (isMovable(items[first - 1])) first -= 1;
  let last = i;
  while (isMovable(items[last + 1])) last += 1;
  return [first, last];
}

export interface MenuReorder {
  /** Some entry can move; the others keep an empty handle space so the labels line up. */
  active: boolean;
  /** The label of the entry being dragged. */
  dragging: string | null;
  /** Pointer down on entry `index`'s handle. */
  startDrag: (index: number, e: PointerEvent<HTMLElement>) => void;
  /** Alt+Up and Alt+Down on entry `index`; true when it took the key. */
  onKey: (index: number, e: KeyboardEvent<HTMLElement>) => boolean;
  /** What a live region reads out after a move. */
  announcement: string;
}

/**
 * Reordering the menu's movable checkbox entries: dragged by the handle, an entry moves as the pointer passes the middle
 * of the next one; Alt+Up and Alt+Down move the focused one. Entries that change place slide there (the `.movable`
 * transition, on the Iris motion tokens).
 */
export function useMenuReorder(
  items: MenuEntry[],
  menuRef: RefObject<HTMLDivElement | null>,
  onMove: ((from: number, to: number) => void) | undefined,
): MenuReorder {
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  // After a move, the next waits until the menu shows the new order.
  const awaitingRender = useRef(false);
  const refocus = useRef<string | null>(null);
  const tops = useRef(new Map<string, number>());
  // The entry being dragged and the pointer's last height.
  const drag = useRef<{ label: string; y: number } | null>(null);

  const move = (from: number, to: number) => {
    const item = itemsRef.current[from];
    if (!onMoveRef.current || item?.kind !== 'checkbox') return;
    awaitingRender.current = true;
    onMoveRef.current(from, to);
    setAnnouncement(`${item.label}, ${to + 1} of ${itemsRef.current.length}`);
  };

  // Moves the dragged entry to where the pointer is: past the middle of each entry it is over.
  const reposition = () => {
    const menu = menuRef.current;
    const d = drag.current;
    if (!menu || !d || awaitingRender.current) return;
    const current = itemsRef.current.findIndex((it) => it.kind === 'checkbox' && it.label === d.label);
    if (current < 0) return;
    const [first, last] = runOf(itemsRef.current, current);
    const y = d.y - menu.getBoundingClientRect().top - menu.clientTop + menu.scrollTop;
    const middle = (k: number) => {
      const row = menu.querySelector<HTMLElement>(`[data-menu-index="${k}"]`);
      return row ? row.offsetTop + row.offsetHeight / 2 : Number.NaN;
    };
    let target = current;
    for (let k = current + 1; k <= last; k += 1) if (middle(k) < y) target = k;
    for (let k = current - 1; k >= first; k -= 1) if (middle(k) > y) target = k;
    if (target !== current) move(current, target);
  };

  // Each render: entries that changed place slide from where they were (FLIP), a key-moved entry keeps focus, and a
  // drag catches up with the pointer, which may have moved on while the menu re-rendered.
  useLayoutEffect(() => {
    awaitingRender.current = false;
    const menu = menuRef.current;
    if (!menu) {
      tops.current = new Map();
      return;
    }
    const rows = Array.from(menu.querySelectorAll<HTMLElement>('[data-menu-movable]'));
    const before = tops.current;
    const shifted = rows.flatMap((row) => {
      const was = before.get(row.dataset.menuLabel ?? '');
      return was == null || was === row.offsetTop ? [] : [{ row, by: was - row.offsetTop }];
    });
    for (const { row, by } of shifted) {
      row.style.transition = 'none';
      row.style.transform = `translateY(${by}px)`;
    }
    if (shifted.length > 0) void menu.offsetHeight;
    for (const { row } of shifted) {
      row.style.transition = '';
      row.style.transform = '';
    }
    tops.current = new Map(rows.map((row) => [row.dataset.menuLabel ?? '', row.offsetTop]));
    if (refocus.current != null) {
      rows.find((row) => row.dataset.menuLabel === refocus.current)?.focus();
      refocus.current = null;
    }
    reposition();
  });

  const startDrag = (index: number, e: PointerEvent<HTMLElement>) => {
    const item = items[index];
    if (!onMove || e.button !== 0 || item?.kind !== 'checkbox') return;
    e.preventDefault();
    drag.current = { label: item.label, y: e.clientY };
    setDragging(item.label);
    const page = { cursor: document.body.style.cursor, userSelect: document.body.style.userSelect };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    // On the window: moving the entry moves its element, which would drop a pointer capture.
    const onPointerMove = (ev: globalThis.PointerEvent) => {
      if (!drag.current) return;
      drag.current.y = ev.clientY;
      reposition();
    };
    const end = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      Object.assign(document.body.style, page);
      drag.current = null;
      setDragging(null);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const onKey = (index: number, e: KeyboardEvent<HTMLElement>) => {
    if (!onMove || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return false;
    e.preventDefault();
    e.stopPropagation();
    const item = items[index];
    if (item?.kind !== 'checkbox' || !isMovable(item)) return true;
    const [first, last] = runOf(items, index);
    const to = index + (e.key === 'ArrowUp' ? -1 : 1);
    if (to < first || to > last) return true;
    refocus.current = item.label;
    move(index, to);
    return true;
  };

  return { active: !!onMove && items.some(isMovable), dragging, startDrag, onKey, announcement };
}
