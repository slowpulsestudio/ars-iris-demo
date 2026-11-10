import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx.js';
import { Icon } from '../Icon/Icon.js';
import { IconButton } from '../IconButton/IconButton.js';
import styles from './Banner.module.css';

export type BannerTone = 'info' | 'warning' | 'error' | 'success';

// As in the UI Kit: Warning uses WarningCircle and Error uses Warning.
const TONE_ICONS: Record<BannerTone, string> = {
  info: 'Info',
  warning: 'WarningCircle',
  error: 'Warning',
  success: 'CheckCircle',
};

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Iris UI Kit "Type". */
  tone?: BannerTone;
  /** Iris UI Kit "Colored": tinted surface instead of the plain one. */
  colored?: boolean;
  title: ReactNode;
  /** Supporting text under the title. */
  children?: ReactNode;
  /** Small buttons, e.g. a primary and a secondary (UI Kit "Actions"). */
  actions?: ReactNode;
  /** Shows the dismiss button (UI Kit "Dismissable"). */
  onDismiss?: () => void;
  dismissLabel?: string;
}

/**
 * Banner — persistent, in-page message matching the Iris UI Kit "Banner"
 * (Component / Banner).
 */
export function Banner({
  tone = 'info',
  colored = false,
  title,
  children,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: BannerProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx(styles.banner, styles[`tone_${tone}`], colored && styles.colored, className)}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon name={TONE_ICONS[tone]} size="24px" />
      </span>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          {children && <div className={styles.supporting}>{children}</div>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {onDismiss && (
        <IconButton icon="X" ariaLabel={dismissLabel} size="s" className={styles.dismiss} onClick={onDismiss} />
      )}
    </div>
  );
}
