import { useSyncExternalStore } from 'react';
import { showToast } from './toastStore.js';

/**
 * notificationsStore — the bell's inbox. Notifications are persistent: they stay until read or cleared.
 * External events (a teammate, an approval) and long or failed Background Jobs add to it; an alert also
 * pushes a toast and, in the real product, an email.
 */

export type NotificationKind = 'mention' | 'approval' | 'job' | 'alert';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  /** A `#/…` address the notification opens. */
  href?: string;
  read: boolean;
  at: number;
}

const MINUTE = 60_000;
const seed = Date.now();

let items: AppNotification[] = [
  { id: 'seed-approval', kind: 'approval', title: 'Approval requested', body: 'Marcus Reed asked for access to Finance Team.', href: '#/user-view/approvals', read: false, at: seed - 42 * MINUTE },
  { id: 'seed-mention', kind: 'mention', title: '@Sarah mentioned you', body: 'Can you check the Test OU move before Friday?', read: false, at: seed - 3 * 60 * MINUTE },
];
let nextId = 1;
const listeners = new Set<() => void>();

function set(next: AppNotification[]) {
  items = next;
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addNotification(n: Omit<AppNotification, 'id' | 'read' | 'at'>): void {
  set([{ ...n, id: `n-${nextId++}`, read: false, at: Date.now() }, ...items]);
}

/** An alert: the stuff the user must not miss. It lands in the inbox and pushes a toast (the real product also emails). */
export function pushAlert(title: string, body: string): void {
  addNotification({ kind: 'alert', title, body });
  showToast(title, { tone: 'warning', icon: 'BellRinging', supportingText: `${body} A copy was sent to your email.` });
}

export function markRead(id: string): void {
  set(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead(): void {
  set(items.map((n) => ({ ...n, read: true })));
}

export function clearNotifications(): void {
  set([]);
}

export function useNotifications(): { items: AppNotification[]; unread: number } {
  const current = useSyncExternalStore(subscribe, () => items);
  return { items: current, unread: current.filter((n) => !n.read).length };
}
