import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import styles from './GhostButton.module.css';

export interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconLead?: string;
}

/**
 * Figma's "Ghost" text button (e.g. "+ Add owner"): the Iris Button, small,
 * with no fill or border. Iris has no ghost text button of its own.
 */
export function GhostButton({ className, ...props }: GhostButtonProps) {
  return <Button {...props} variant="secondary" size="s" className={cx(styles.ghost, className)} />;
}
