import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { navigate } from '../../lib/router.js';
import { useOutsideDismiss } from '../../lib/useOutsideDismiss.js';
import {
  clearNotifications,
  markAllRead,
  markRead,
  useNotifications,
  type AppNotification,
  type NotificationKind,
} from '../../lib/notificationsStore.js';
import styles from './NotificationsBell.module.css';

const KIND_ICON: Record<NotificationKind, string> = {
  mention: 'ChatCircle',
  approval: 'CheckCircle',
  job: 'ListChecks',
  alert: 'BellRinging',
};

function ago(at: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - at) / 60_000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
}

/**
 * The bell and its inbox panel. Notifications persist until read: a dot on the bell while any is unread, click a
 * row to mark it read and open what it links to, or mark them all read.
 */
export function NotificationsBell() {
  const { items, unread } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closePanel = useCallback(() => setOpen(false), []);

  useOutsideDismiss(open, [wrapRef, panelRef], closePanel);

  const openItem = (n: AppNotification) => {
    markRead(n.id);
    if (n.href) {
      setOpen(false);
      navigate(n.href);
    }
  };

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <IconButton
        icon="Bell"
        ariaLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      />
      {unread > 0 && <span className={styles.dot} aria-hidden="true" />}
      {open &&
        createPortal(
          <div ref={panelRef} className={styles.panel} role="dialog" aria-label="Notifications">
            <div className={styles.head}>
              <h2 className={styles.title}>Notifications</h2>
              <div className={styles.headActions}>
                <Button variant="ghost" size="s" onClick={markAllRead} disabled={unread === 0}>
                  Mark all read
                </Button>
                <Button variant="ghost" size="s" onClick={clearNotifications} disabled={items.length === 0}>
                  Clear
                </Button>
              </div>
            </div>
            {items.length === 0 ? (
              <p className={styles.empty}>You're all caught up.</p>
            ) : (
              <ul className={styles.list}>
                {items.map((n) => (
                  <li key={n.id}>
                    <button type="button" className={styles.row} data-unread={n.read ? undefined : 'true'} onClick={() => openItem(n)}>
                      <span className={styles.kind} aria-hidden="true">
                        <Icon name={KIND_ICON[n.kind]} size="20px" />
                      </span>
                      <span className={styles.text}>
                        <span className={styles.rowTitle}>{n.title}</span>
                        {n.body && <span className={styles.body}>{n.body}</span>}
                        <span className={styles.time}>{ago(n.at)}</span>
                      </span>
                      {!n.read && <span className={styles.unread} aria-label="Unread" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body,
        )}
    </span>
  );
}
