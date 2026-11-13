import { useMemo, useState } from 'react';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import type { Condition, ParameterDef } from '@iris/components/Filters/filterModel.js';
import styles from './FilterValueEditor.module.css';

export interface FilterValueEditorProps {
  condition: Condition;
  parameter?: ParameterDef;
  onChange: (patch: Partial<Omit<Condition, 'kind' | 'id'>>) => void;
  /** Enter in a text or date input: the value is final. */
  onDone?: () => void;
}

/** Lists with more values than this get a search box. */
const SEARCH_FROM = 8;

/** The operators that pick from the field's values; the others (contains, matches, less than…) take typed text. */
const LIST_OPERATORS = new Set(['eq', 'neq', 'in', 'nin']);

/**
 * FilterValueEditor — the value of one condition, edited in the popover that opens under a Bar pill's
 * value: a checklist for a field with a list of values, two dates for "is between", a date or text input otherwise.
 * Figma: Iris UI Kit "Advanced Filter Bar" value menu (FilterSelect, 240px) 9710:8598.
 */
export function FilterValueEditor({ condition, parameter, onChange, onDone }: FilterValueEditorProps) {
  const [search, setSearch] = useState('');
  const label = parameter?.label ?? 'Value';
  const inputType = parameter?.date ? 'date' : 'text';
  const options = parameter?.options ?? [];
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, search]);

  if (condition.operatorId === 'between') {
    return (
      <div className={styles.fields}>
        <TextInput
          autoFocus
          type={inputType}
          value={condition.values[0] ?? ''}
          aria-label={`${label} from`}
          onChange={(e) => onChange({ values: [e.target.value, condition.values[1] ?? ''] })}
        />
        <span className={styles.and}>and</span>
        <TextInput
          type={inputType}
          value={condition.values[1] ?? ''}
          aria-label={`${label} to`}
          onChange={(e) => onChange({ values: [condition.values[0] ?? '', e.target.value] })}
          onKeyDown={(e) => e.key === 'Enter' && onDone?.()}
        />
      </div>
    );
  }

  if (options.length && (!condition.operatorId || LIST_OPERATORS.has(condition.operatorId))) {
    const chosen = new Set(condition.values);
    const toggle = (value: string, on: boolean) => {
      const next = new Set(chosen);
      if (on) next.add(value);
      else next.delete(value);
      onChange({ values: [...next] });
    };
    return (
      <div className={styles.list}>
        {options.length > SEARCH_FROM && (
          <TextInput
            autoFocus
            value={search}
            placeholder="Search…"
            aria-label={`Search ${label}`}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className={styles.rows} role="group" aria-label={label}>
          {shown.map((o) => (
            <div key={o.value} className={styles.row}>
              <Checkbox checked={chosen.has(o.value)} label={o.label} onChange={(on) => toggle(o.value, on)} />
            </div>
          ))}
          {shown.length === 0 && <p className={styles.none}>No matches</p>}
        </div>
      </div>
    );
  }

  return (
    <TextInput
      autoFocus
      type={inputType}
      value={condition.values[0] ?? ''}
      placeholder="Enter a value..."
      aria-label={`${label} value`}
      onChange={(e) => onChange({ values: e.target.value ? [e.target.value] : [] })}
      onKeyDown={(e) => e.key === 'Enter' && onDone?.()}
    />
  );
}
