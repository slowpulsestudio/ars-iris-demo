import { cx } from '@iris/lib/cx.js';
import { Badge } from '@iris/components/Badge/Badge.js';
import { Button } from '@iris/components/Button/Button.js';
import type { FormInputProps } from '../../parts/FormInput/FormInput.js';
import { DetailsCard, type DetailsRow } from '../../parts/DetailsCard/DetailsCard.js';
import styles from './ARSGroupGeneralContent.module.css';

export type ARSGroupGeneralContentVariant = 'Default' | 'Variant2' | 'Variant3';

const DESCRIPTION =
  'Nullam laoreet erat id felis iaculis, efficitur aliquam velit pharetra. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum sed consectetur dui. Pellentesque at lectus in massa venenatis scelerisque.';

const badge = (label: string) => <Badge className={styles.badge}>{label}</Badge>;

const ROWS: DetailsRow[] = [
  { label: 'Group name', value: 'Security Users' },
  { label: 'Display name', value: 'Security Users' },
  { label: 'Description', value: DESCRIPTION },
  { label: 'Resource URL', value: '-' },
  { label: 'Group scope', value: badge('Global') },
  { label: 'Group type', value: badge('Security') },
];

const FIELDS: FormInputProps[] = [
  { label: 'Group name', value: 'Security Users', required: true, width: 280 },
  { label: 'Display name', value: 'Security Users', required: true, width: 280 },
  { label: 'Description', value: DESCRIPTION, multiline: true },
  { label: 'Resource URL', width: 280 },
  { label: 'Group scope', value: 'Global', required: true, width: 280, iconTrail: 'CaretDown' },
  { label: 'Group Type', value: 'Security', required: true, width: 280, iconTrail: 'CaretDown' },
];

export interface ARSGroupGeneralContentProps {
  /** Figma "Property 1": Default (read), Variant2 (read, hovered), Variant3 (edit). */
  variant?: ARSGroupGeneralContentVariant;
  onEdit?: () => void;
  onSave?: () => void;
  className?: string;
}

/**
 * ARS_Group_General content — a group's Properties card. Hovering the read
 * card fills it grey and shows Edit (Figma's Variant2). Figma: 2944:30704.
 */
export function ARSGroupGeneralContent({ variant = 'Default', onEdit, onSave, className }: ARSGroupGeneralContentProps) {
  const editing = variant === 'Variant3';
  return (
    <DetailsCard
      title="Properties"
      helper="Manage group name and type."
      editing={editing}
      rows={ROWS}
      fields={FIELDS}
      labelWidth={130}
      compactFields
      actions={
        editing ? (
          <Button size="s" iconLead="KeyReturn" onClick={onSave}>
            Save
          </Button>
        ) : (
          <Button variant="secondary" size="s" className={styles.edit} onClick={onEdit}>
            Edit
          </Button>
        )
      }
      className={cx(styles.card, !editing && styles.readable, variant === 'Variant2' && styles.hovered)}
    />
  );
}
