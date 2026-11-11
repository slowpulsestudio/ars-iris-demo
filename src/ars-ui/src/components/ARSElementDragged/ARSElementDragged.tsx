import { Icon } from '@iris/components/Icon/Icon.js';
import { cx } from '@iris/lib/cx.js';
import styles from './ARSElementDragged.module.css';

export interface ARSElementDraggedProps {
  /** Figma "Variant". */
  variant?: 'Directory folder' | 'User';
  /** The dragged object's name. */
  label: string;
  className?: string;
}

/**
 * Element-Dragged — the chip that follows the pointer while an object is
 * dragged: a handle, an icon and the name. Figma: 2281:47208 (variants
 * Directory folder 2244:14604, User 2281:47209) in ARS_WebUI2_Move_Browse_Objects.
 */
export function ARSElementDragged({ variant = 'Directory folder', label, className }: ARSElementDraggedProps) {
  const user = variant === 'User';
  return (
    <div className={cx(styles.root, user && styles.user, className)}>
      <div className={styles.element}>
        <span className={styles.icons}>
          <Icon name="DotsSixVertical" size="16px" />
          <Icon name={user ? 'User' : 'Folder'} size="16px" />
        </span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
