import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ARSFilterMenu, ARSFilterSelect, type ARSFilterSelectPart } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { Menu } from '../../components/Menu/Menu.js';
import { Modal } from '../../components/Modal/Modal.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { useHashParam } from '../../lib/hashState.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import {
  FILTER_FIELDS,
  matchesFilters,
  optionsFor,
  parseFilters,
  serializeFilters,
  setValues,
  toggleValue,
  valueLabel,
  type ActiveFilter,
  type FilterField,
  type FilterRow,
} from '../../lib/listFilters.js';
import styles from './ListFilters.module.css';

const FIELD_ICON: Record<FilterField, string> = {
  'Display name': 'MagnifyingGlass',
  'Object type': 'Cube',
  Tags: 'Tag',
  Location: 'MapPin',
  'Date active': 'CalendarBlank',
  'Date created': 'CalendarBlank',
};

const TYPE_ICON: Record<string, string> = {
  User: 'User',
  Group: 'UsersThree',
  Computer: 'Desktop',
  Contact: 'AddressBook',
};

function pillParts({ field, values }: ActiveFilter): ARSFilterSelectPart[] {
  const object = (value: string): ARSFilterSelectPart => ({
    kind: 'object',
    label: valueLabel(field, value),
    icon: field === 'Object type' ? (TYPE_ICON[value] ?? FIELD_ICON[field]) : FIELD_ICON[field],
  });
  return [{ kind: 'field', label: field }, { kind: 'rule', label: field === 'Display name' ? 'contains' : 'is' }, ...values.map(object)];
}

/**
 * The Filters button's behaviour for a list. Figma draws the Filters menu (ARS_Filter_Menu) and the
 * filter pill (ARS_filter-select) but not the step between them, so choosing the values is built
 * from the Iris menu and modal: a value list for most fields, a text box for Display name. The filters
 * live in the address (`?filter=Tags~Security|Helpdesk;Location~Entra`).
 */
export function useListFilters<T>(items: T[], toRow: (item: T) => FilterRow) {
  const [param, setParam] = useHashParam('filter');
  const filters = useMemo(() => parseFilters(param), [param]);
  const fieldMenu = useAnchoredMenu();
  const [valueMenu, setValueMenu] = useState<{ field: FilterField; position: { x: number; y: number; yAbove: number } } | null>(null);
  const [nameOpen, setNameOpen] = useState(false);
  const [name, setName] = useState('');

  const rows = useMemo(() => items.map(toRow), [items, toRow]);
  const filtered = useMemo(
    () => (filters.length ? items.filter((_, i) => matchesFilters(rows[i], filters)) : items),
    [items, rows, filters],
  );

  const update = (next: ActiveFilter[]) => setParam(serializeFilters(next));

  const onField = (label: string) => {
    if (!FILTER_FIELDS.includes(label as FilterField)) return;
    const field = label as FilterField;
    if (field === 'Display name') {
      setName(filters.find((f) => f.field === field)?.values[0] ?? '');
      setNameOpen(true);
      return;
    }
    const position = fieldMenu.menuProps.position;
    if (position) setValueMenu({ field, position: { ...position, yAbove: position.yAbove ?? position.y } });
  };

  const options = valueMenu ? optionsFor(valueMenu.field, rows) : [];
  const ticked = new Set(filters.find((f) => f.field === valueMenu?.field)?.values ?? []);

  const applyName = () => {
    update(setValues(filters, 'Display name', name.trim() ? [name.trim()] : []));
    setNameOpen(false);
  };

  const elements: ReactNode = (
    <>
      <ARSFilterMenu {...fieldMenu.menuProps} onAction={onField} />
      {valueMenu && (
        <Menu
          open
          position={valueMenu.position}
          onOpenChange={(open) => {
            if (!open) setValueMenu(null);
          }}
          ariaLabel={`Filter by ${valueMenu.field}`}
          items={
            options.length
              ? options.map((o) => ({
                  kind: 'item' as const,
                  label: o.label,
                  selected: ticked.has(o.value),
                  onSelect: () => update(toggleValue(filters, valueMenu.field, o.value)),
                }))
              : [{ kind: 'item' as const, label: `No ${valueMenu.field.toLowerCase()} values`, disabled: true }]
          }
        />
      )}
      <Modal
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        title="Display name"
        subtitle="Show only items whose name contains:"
        size="s"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyName}>Apply</Button>
          </>
        }
      >
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyName();
          }}
          placeholder="Display name"
          aria-label="Display name contains"
          autoFocus
        />
      </Modal>
    </>
  );

  // While the row closes, the pills that were there stay drawn so the row shrinks rather than empties.
  const lastShown = useRef(filters);
  if (filters.length) lastShown.current = filters;
  const shown = filters.length ? filters : lastShown.current;

  const bar: ReactNode = (
    <div className={styles.row} role="group" aria-label="Applied filters">
      {shown.map((f) => (
        <ARSFilterSelect key={f.field} parts={pillParts(f)} onRemove={() => update(filters.filter((x) => x.field !== f.field))} />
      ))}
    </div>
  );

  return { filtered, bar, barOpen: filters.length > 0, elements, openFilters: fieldMenu.openAt };
}
