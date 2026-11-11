import { useId } from 'react';
import { cx } from '../../lib/cx.js';
import styles from './Radio.module.css';

export interface RadioProps {
  /** Names the group for assistive technology. */
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Radio — a group of radio buttons where one option is chosen. Matches the
 * Iris UI Kit "Radio buttons" (Component / Radio buttons).
 */
export function Radio({ label, options, value, onChange, className }: RadioProps) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cx(styles.group, className)}>
      {options.map((option) => (
        <label key={option} className={styles.field}>
          <span className={styles.wrap}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={option === value}
              onChange={() => onChange(option)}
            />
            <span className={styles.circle} aria-hidden="true" />
          </span>
          <span className={styles.label}>{option}</span>
        </label>
      ))}
    </div>
  );
}
