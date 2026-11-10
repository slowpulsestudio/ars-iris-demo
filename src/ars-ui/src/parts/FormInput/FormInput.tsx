import { cx } from '@iris/lib/cx.js';
import { FormField } from '@iris/components/FormField/FormField.js';
import { Select } from '@iris/components/Select/Select.js';
import { TextInput } from '@iris/components/TextInput/TextInput.js';
import { Textarea } from '@iris/components/Textarea/Textarea.js';
import styles from './FormInput.module.css';

export interface FormInputProps {
  label: string;
  /** Starting value; the field stays editable. */
  value?: string;
  required?: boolean;
  /** Trailing icon, e.g. CaretDown for a picker or Calendar for a date. */
  iconTrail?: string;
  /** Renders Figma's "Text area" instead of "Text input". */
  multiline?: boolean;
  /** Renders Figma's "Dropdown", which Figma links to the Iris Select. */
  select?: boolean;
  /** Figma's fixed field width in px (no token); fills the row when omitted. */
  width?: number;
  className?: string;
}

/**
 * Iris FormField + TextInput / Textarea / Select (Iris UI Kit "Text input",
 * "Text area", "Dropdown") with the ARS file's grey fill.
 */
export function FormInput({ label, value, required, iconTrail, multiline, select, width, className }: FormInputProps) {
  return (
    <div className={cx(styles.root, !width && styles.fill, className)} style={width ? { width } : undefined}>
      <FormField label={label} required={required} className={styles.field}>
        {select ? (
          <Select label={value ?? ''} />
        ) : multiline ? (
          <Textarea defaultValue={value} className={styles.textarea} />
        ) : (
          <TextInput defaultValue={value} iconTrail={iconTrail} className={styles.input} />
        )}
      </FormField>
    </div>
  );
}
