import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ObjectIcon.module.css';

export interface ObjectIconProps {
  icon: string;
  className?: string;
}

/** The 48px round icon that marks an object (OU, user…) in ARS headers. */
export function ObjectIcon({ icon, className }: ObjectIconProps) {
  return (
    <span className={cx(styles.circle, className)} aria-hidden="true">
      <Icon name={icon} size="24px" />
    </span>
  );
}
