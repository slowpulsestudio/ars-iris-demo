import { cx } from '@iris/lib/cx.js';
import graphic from '../../assets/empty-filter-graphic.svg?raw';
import styles from './EmptyFilterGraphic.module.css';

export interface EmptyFilterGraphicProps {
  className?: string;
}

/**
 * EmptyFilterGraphic — the drawing in the empty Advanced filter Panel, exported from Figma and recoloured
 * with Iris tokens so it follows the theme. Figma: Iris UI Kit ".illu (temp)" 9896:1571 (ARS Advanced
 * Search "Iris empty filter graphic" 4090:112651).
 */
export function EmptyFilterGraphic({ className }: EmptyFilterGraphicProps) {
  // The SVG is a static file from Figma, bundled at build time.
  return <span className={cx(styles.root, className)} aria-hidden="true" dangerouslySetInnerHTML={{ __html: graphic }} />;
}
