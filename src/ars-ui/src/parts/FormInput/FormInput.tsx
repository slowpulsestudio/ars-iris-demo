import type { Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { Checkbox } from '@iris/components/Checkbox/Checkbox.js';
import { Menu, type MenuEntry } from '@iris/components/Menu/Menu.js';
import { Radio } from '@iris/components/Radio/Radio.js';
import { Select } from '@iris/components/Select/Select.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Textarea } from '@iris/components/Textarea/Textarea.js';
import styles from './FormInput.module.css';

export interface FormInputProps {
  label: string;
  /** Starting value, or the current value when `onChange` is set. */
  value?: string;
  /** Makes the field controlled by `value`. */
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Tooltip text for the label's info icon (Figma "Security/Info"). */
  info?: string;
  /** Error message under the field; also marks the field invalid. */
  error?: string;
  /** Help message under the field (Figma ".Input feedback messages"). */
  help?: string;
  /** Character limit; shows Figma's "0/100" count in the label row. */
  maxLength?: number;
  type?: 'text' | 'password';
  /** Trailing icon, e.g. CaretDown for a picker or Calendar for a date. */
  iconTrail?: string;
  /** Renders Figma's "Text area" instead of "Text input". */
  multiline?: boolean;
  /** Renders Figma's "Dropdown", which Figma links to the Iris Select. */
  select?: boolean;
  /** Dropdown choices; the dropdown opens a menu of them. */
  options?: string[];
  /** Shows `options` as radio buttons instead of a dropdown (Figma "Radio buttons"). */
  radio?: boolean;
  /** Draws a checkbox labelled with `label`; `value` is "true" or "false". */
  checkbox?: boolean;
  disabled?: boolean;
  /** Figma's fixed field width in px (no token); fills the row when omitted. */
  width?: number;
  className?: string;
}

/**
 * Iris FormField + TextInput / Textarea / Select (Iris UI Kit "Text input",
 * "Text area", "Dropdown") with the ARS file's grey fill.
 */
export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  info,
  error,
  help,
  maxLength,
  type,
  iconTrail,
  multiline,
  select,
  options,
  radio,
  checkbox,
  disabled,
  width,
  className,
}: FormInputProps) {
  const valueProps = onChange ? { value: value ?? '' } : { defaultValue: value };
  const change = onChange && { onChange: (e: { target: { value: string } }) => onChange(e.target.value) };

  const dropdown = (
    <Menu
      ariaLabel={label}
      align="start"
      items={(options ?? []).map<MenuEntry>((option) => ({
        kind: 'item',
        label: option,
        selected: option === value,
        onSelect: () => onChange?.(option),
      }))}
      trigger={({ ref, onClick, expanded }) => (
        <Select
          ref={ref as Ref<HTMLButtonElement>}
          label={value ?? ''}
          placeholder={placeholder}
          onClick={onClick}
          aria-haspopup="listbox"
          aria-expanded={expanded}
        />
      )}
    />
  );

  return (
    <div className={cx(styles.root, !width && styles.fill, className)} style={width ? { width } : undefined}>
      {checkbox ? (
        <Checkbox
          label={label}
          checked={value === 'true'}
          disabled={disabled}
          onChange={(on) => onChange?.(String(on))}
        />
      ) : (
      <FormField
        label={label}
        required={required}
        helperText={info}
        error={error}
        help={help}
        count={maxLength === undefined ? undefined : `${(value ?? '').length}/${maxLength}`}
        className={styles.field}
      >
        {radio && options ? (
          <Radio label={label} options={options} value={value ?? ''} onChange={(next) => onChange?.(next)} />
        ) : select ? (
          options ? dropdown : <Select label={value ?? ''} />
        ) : multiline ? (
          <Textarea {...valueProps} {...change} placeholder={placeholder} maxLength={maxLength} className={styles.textarea} />
        ) : (
          <TextInput
            type={type}
            {...valueProps}
            {...change}
            placeholder={placeholder}
            maxLength={maxLength}
            iconTrail={iconTrail}
            disabled={disabled}
            className={styles.input}
          />
        )}
      </FormField>
      )}
    </div>
  );
}
