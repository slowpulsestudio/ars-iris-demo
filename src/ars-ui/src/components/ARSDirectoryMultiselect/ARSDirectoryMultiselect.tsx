import { MultiSelect, type MultiSelectOption } from '@iris/components/MultiSelect/MultiSelect.js';
import { Select } from '@iris/components/Select/Select.js';
import styles from './ARSDirectoryMultiselect.module.css';

export interface ARSDirectoryMultiselectProps {
  /** Directories: title, meta text and icon. */
  options: MultiSelectOption[];
  selected: Set<string>;
  onSelectionChange: (next: Set<string>) => void;
  /** Trigger label; the selected count is appended, e.g. "All directories (4 selected)". */
  label?: string;
  searchPlaceholder?: string;
  /** Show the panel on mount. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * ARS_Directory_Multiselect — the directory picker: the Iris MultiSelect
 * panel (search input, multi-select items, Clear / Select all) opened from an
 * Iris Select (Large), as in ARS_Directory_Management_Panel. Figma: 4596:20589.
 */
export function ARSDirectoryMultiselect({
  options,
  selected,
  onSelectionChange,
  label = 'All directories',
  searchPlaceholder = 'Search directories',
  defaultOpen,
  className,
}: ARSDirectoryMultiselectProps) {
  return (
    <MultiSelect
      options={options}
      selected={selected}
      onSelectionChange={onSelectionChange}
      label={label}
      ariaLabel="Directories"
      searchPlaceholder={searchPlaceholder}
      defaultOpen={defaultOpen}
      renderTrigger={({ ref, onClick, expanded, count }) => (
        <Select
          ref={ref}
          size="l"
          label={count > 0 ? `${label} (${count} selected)` : label}
          onClick={onClick}
          aria-haspopup="listbox"
          aria-expanded={expanded}
          className={className ?? styles.trigger}
        />
      )}
    />
  );
}
