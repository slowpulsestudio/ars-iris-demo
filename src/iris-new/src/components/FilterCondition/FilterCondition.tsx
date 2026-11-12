import { useMemo, type Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { MultiSelect } from '@iris/components/MultiSelect/MultiSelect.js';
import { Select } from '@iris/components/Select/Select.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import {
  OPERATORS,
  OPERATOR_BY_ID,
  operatorTakesValue,
  type Condition,
  type ParameterDef,
} from '@iris/components/Filters/filterModel.js';
import styles from './FilterCondition.module.css';

export interface FilterConditionProps {
  condition: Condition;
  parameters: ParameterDef[];
  onChange: (patch: Partial<Omit<Condition, 'kind' | 'id'>>) => void;
  onRemove: () => void;
  className?: string;
}

/** What the "Select a parameter…" placeholder icon is in the Iris UI Kit: a dashed selection square. */
const PLACEHOLDER_ICON = 'SelectionAll';

/**
 * FilterCondition — one Advanced filter "Panel" condition: parameter and operator selects, then the
 * value and a delete. Below ~420px the three controls stack along a tree trail.
 * Figma: Iris UI Kit ".Parameter" 9950:2946, ".Operator" 9950:3029, ".tree trail" 9722:13236.
 */
export function FilterCondition({ condition, parameters, onChange, onRemove, className }: FilterConditionProps) {
  const param = parameters.find((p) => p.id === condition.parameterId);
  const op = condition.operatorId ? OPERATOR_BY_ID[condition.operatorId] : undefined;

  const parameterItems: MenuEntry[] = parameters.map((p) => ({
    kind: 'item',
    label: p.label,
    icon: p.icon,
    selected: p.id === condition.parameterId,
    // The value type can differ between parameters, so a new parameter clears the value.
    onSelect: () => onChange({ parameterId: p.id, values: [] }),
  }));

  const operatorItems: MenuEntry[] = OPERATORS.map((o) => ({
    kind: 'item',
    label: o.label,
    icon: o.icon,
    selected: o.id === condition.operatorId,
    onSelect: () =>
      onChange(
        o.id === 'empty' || o.id === 'between' || condition.operatorId === 'between'
          ? { operatorId: o.id, values: [] }
          : { operatorId: o.id },
      ),
  }));

  const optionLabel = useMemo(
    () => new Map((param?.options ?? []).map((o) => [o.value, o.label])),
    [param],
  );

  const showValue = operatorTakesValue(condition.operatorId);
  const inputType = param?.date ? 'date' : 'text';

  const valueField = !showValue ? null : condition.operatorId === 'between' ? (
    <div className={styles.range}>
      <TextInput
        type={inputType}
        value={condition.values[0] ?? ''}
        placeholder="From"
        aria-label={`${param?.label ?? 'Value'} from`}
        onChange={(e) => onChange({ values: [e.target.value, condition.values[1] ?? ''] })}
      />
      <span className={styles.and}>and</span>
      <TextInput
        type={inputType}
        value={condition.values[1] ?? ''}
        placeholder="To"
        aria-label={`${param?.label ?? 'Value'} to`}
        onChange={(e) => onChange({ values: [condition.values[0] ?? '', e.target.value] })}
      />
    </div>
  ) : param?.options?.length ? (
    <MultiSelect
      options={param.options.map((o) => ({ value: o.value, title: o.label, icon: o.icon }))}
      selected={new Set(condition.values)}
      onSelectionChange={(next) => onChange({ values: [...next] })}
      label={param.label}
      align="start"
      ariaLabel={`${param.label} value`}
      renderTrigger={({ ref, onClick, expanded }) => (
        <Select
          ref={ref as Ref<HTMLButtonElement>}
          label={condition.values.map((v) => optionLabel.get(v) ?? v).join(', ')}
          placeholder="Select a value..."
          aria-haspopup="listbox"
          aria-expanded={expanded}
          onClick={onClick}
        />
      )}
    />
  ) : (
    <TextInput
      type={inputType}
      value={condition.values[0] ?? ''}
      placeholder="Enter a value..."
      aria-label={param ? `${param.label} value` : 'Value'}
      onChange={(e) => onChange({ values: e.target.value ? [e.target.value] : [] })}
    />
  );

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.selectors}>
        <Menu
          ariaLabel="Select a parameter"
          align="start"
          items={parameterItems}
          trigger={({ ref, onClick, expanded }) => (
            <Select
              ref={ref as Ref<HTMLButtonElement>}
              className={styles.select}
              iconLead={param ? param.icon : PLACEHOLDER_ICON}
              label={param?.label ?? ''}
              placeholder="Select a parameter..."
              aria-haspopup="menu"
              aria-expanded={expanded}
              onClick={onClick}
            />
          )}
        />
        <Menu
          ariaLabel="Select an operator"
          align="start"
          items={operatorItems}
          trigger={({ ref, onClick, expanded }) => (
            <Select
              ref={ref as Ref<HTMLButtonElement>}
              className={styles.select}
              iconLead={op ? op.icon : PLACEHOLDER_ICON}
              label={op?.label ?? ''}
              placeholder="Select an operator.."
              aria-haspopup="menu"
              aria-expanded={expanded}
              onClick={onClick}
            />
          )}
        />
      </div>
      <div className={styles.valueRow}>
        <div className={styles.value}>{valueField}</div>
        <IconButton icon="Trash" ariaLabel="Delete condition" size="s" variant="ghost" onClick={onRemove} />
      </div>
    </div>
  );
}
