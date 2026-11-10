import { useState } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './SubTabs.module.css';

export interface SubTab {
  label: string;
  icon: string;
}

export interface SubTabsProps {
  tabs: SubTab[];
  defaultValue: string;
  value?: string;
  onChange?: (label: string) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Iris UI Kit "Segmented control" as drawn in the ARS file: icon + label in a
 * row. The Iris code SegmentedControl is a different, stacked design.
 */
export function SubTabs({ tabs, defaultValue, value, onChange, ariaLabel, className }: SubTabsProps) {
  const [current, setCurrent] = useState(defaultValue);
  const selected = value ?? current;
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx(styles.root, className)}>
      {tabs.map((tab) => {
        const isSelected = tab.label === selected;
        return (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={cx(styles.item, isSelected && styles.selected)}
            onClick={() => {
              setCurrent(tab.label);
              onChange?.(tab.label);
            }}
          >
            <Icon name={tab.icon} size="20px" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
