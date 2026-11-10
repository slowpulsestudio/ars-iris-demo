import { useState } from 'react';
import { Tabs } from '@iris/components/Tabs/Tabs.js';

export interface ObjectTabsProps {
  /** Tab labels as Figma draws them, counts included, e.g. "Memberships (8)". */
  tabs: string[];
  /** The tab selected at first. */
  defaultValue: string;
  /** Controls the selected tab; leave unset to let the tabs keep their own state. */
  value?: string;
  onChange?: (tab: string) => void;
  ariaLabel: string;
  className?: string;
}

/** The tabs under an object's page header: Iris Tabs (Iris UI Kit "Tabs") that keep their own selection. */
export function ObjectTabs({ tabs, defaultValue, value, onChange, ariaLabel, className }: ObjectTabsProps) {
  const [current, setCurrent] = useState(defaultValue);
  return (
    <Tabs
      items={tabs.map((tab) => ({ value: tab, label: tab }))}
      value={value ?? current}
      onChange={(tab) => {
        setCurrent(tab);
        onChange?.(tab);
      }}
      ariaLabel={ariaLabel}
      className={className}
    />
  );
}
