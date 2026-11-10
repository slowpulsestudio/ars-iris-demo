import { cx } from '@iris/lib/cx.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import styles from './SearchInput.module.css';

export interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

/** The ARS file's search box: Iris TextInput (UI Kit "Text input") with a magnifying glass. */
export function SearchInput({ placeholder, value, onChange, ariaLabel = 'Search', className }: SearchInputProps) {
  return (
    <div className={cx(styles.root, className)}>
      <TextInput
        className={styles.search}
        iconLead="MagnifyingGlass"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
