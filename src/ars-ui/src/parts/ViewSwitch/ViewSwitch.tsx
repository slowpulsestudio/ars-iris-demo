import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './ViewSwitch.module.css';

export interface ViewSwitchItem {
  value: string;
  label: string;
  icon: string;
}

export interface ViewSwitchProps {
  items: ViewSwitchItem[];
  value: string;
  onChange?: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * The ARS file's stacked view switch (plain frame "Segmented control",
 * ARS - Primary 2385:54130): 76×48 items with a 20px icon over a caption.
 */
export function ViewSwitch({ items, value, onChange, ariaLabel, className }: ViewSwitchProps) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx(styles.root, className)}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cx(styles.item, selected && styles.selected)}
            onClick={() => onChange?.(item.value)}
          >
            <Icon name={item.icon} size="20px" />
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
