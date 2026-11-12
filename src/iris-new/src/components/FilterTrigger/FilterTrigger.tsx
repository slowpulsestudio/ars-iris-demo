import { Button, type ButtonProps } from '@iris/components/Button/Button.js';
import { cx } from '@iris/lib/cx.js';
import styles from './FilterTrigger.module.css';

export interface FilterTriggerProps extends Omit<ButtonProps, 'variant' | 'iconLead' | 'iconOnly'> {
  /** Shows the brand dot when a filter is applied. Figma ".dot-indicator" 10012:4733. */
  active?: boolean;
}

/** FilterTrigger — the content header "Filter" button, with the dot when a filter is on. */
export function FilterTrigger({ active = false, children = 'Filter', className, ...rest }: FilterTriggerProps) {
  return (
    <span className={cx(styles.root, className)}>
      <Button variant="secondary" iconLead="FunnelSimple" {...rest}>
        {children}
      </Button>
      {active && <span className={styles.dot} role="img" aria-label="Filter applied" />}
    </span>
  );
}
