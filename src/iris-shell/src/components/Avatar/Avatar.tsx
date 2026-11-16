import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Avatar.module.css';

export type AvatarTone = 'blue' | 'purple' | 'pink' | 'green' | 'orange';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Used for alt text and initials fallback. */
  name: string;
  /** Iris UI Kit sizes: Small 16, Medium 24, Default 32, Large 48, and 80 for a profile header. */
  size?: 's' | 'm' | 'default' | 'l' | 'xl';
  /** Coloured initials, as the self-service person cards draw them (Figma 10301:2300). */
  tone?: AvatarTone;
}

/**
 * Avatar — circular user avatar with image + initials fallback.
 */
export function Avatar({ src, name, size = 'default', tone, className, ...rest }: AvatarProps) {
  const initials = getInitials(name);
  return (
    <span
      className={cx(styles.avatar, styles[`size_${size}`], tone && !src && styles[`tone_${tone}`], className)}
      role="img"
      aria-label={name}
      {...rest}
    >
      {src ? (
        <img src={src} alt="" className={styles.img} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
}

function getInitials(name: string | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}
