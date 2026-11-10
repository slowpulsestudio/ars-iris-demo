import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Spinner.module.css';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Iris UI Kit sizes: Small 16, Default 24, Large 40. */
  size?: 's' | 'default' | 'l';
  /** 0–1 for known progress (UI Kit "Completion"); leave unset to spin (UI Kit "Loop"). */
  progress?: number;
  /** Accessible name. */
  label?: string;
}

// The UI Kit ring in a 24-unit box: outer radius 12, 3.6 thick.
const STROKE = 3.6;
const RADIUS = 12 - STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Spinner — loading indicator matching the Iris UI Kit "Spinner"
 * (Component / Spinner): an info-tinted track with a blue arc.
 */
export function Spinner({ size = 'default', progress, label = 'Loading', className, ...rest }: SpinnerProps) {
  const known = progress !== undefined;
  const fraction = known ? Math.min(Math.max(progress, 0), 1) : 0.25;
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={known ? 0 : undefined}
      aria-valuemax={known ? 100 : undefined}
      aria-valuenow={known ? Math.round(fraction * 100) : undefined}
      className={cx(styles.spinner, styles[`size_${size}`], !known && styles.loop, className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r={RADIUS} strokeWidth={STROKE} fill="none" />
        <circle
          className={styles.arc}
          cx="12"
          cy="12"
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform="rotate(-90 12 12)"
        />
      </svg>
    </span>
  );
}
