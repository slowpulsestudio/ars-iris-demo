import { useEffect, useMemo, useState } from 'react';
import { ARSAddMemberModal, ARSManagedBy, type DetailsRow, type FormInputProps } from '@ars';
import { useDirectory } from '../../lib/directoryStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

type Picker = 'manager' | 'owner' | null;
type Draft = {
  manager: string;
  secondaryOwners: string[];
  managerCanUpdate: boolean;
  secondaryCanUpdate: boolean;
  office: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  fax: string;
};

const PICKER_PAGE_SIZE = 10;
const shown = (value: string) => (value.trim() ? value : '-');

export interface OwnershipTabProps {
  object: DirectoryObject;
  /** The folder whose users can be picked as manager or owner. */
  candidateNodeId: string;
  /** "Group" or "Organizational Unit", for the toast. */
  objectLabel: string;
  /** Adds "can update membership list" checkboxes (groups only). */
  membershipFlags?: boolean;
  onDirtyChange: (dirty: boolean) => void;
  requestLeave: (action: () => void) => void;
}

/**
 * OwnershipTab — the Managed by card (ARS_Managed_by): manager, office
 * details and secondary owners, read or edited, with the picker modal for
 * "Add manager" and "Add owner".
 */
export function OwnershipTab({
  object,
  candidateNodeId,
  objectLabel,
  membershipFlags = false,
  onDirtyChange,
  requestLeave,
}: OwnershipTabProps) {
  const { getSiblings } = useDirectory();
  const p = useGroupProps(object);
  const saved: Draft = useMemo(
    () => ({
      manager: p.manager,
      secondaryOwners: p.secondaryOwners,
      managerCanUpdate: p.managerCanUpdate,
      secondaryCanUpdate: p.secondaryCanUpdate,
      office: p.office,
      street: p.street,
      city: p.city,
      state: p.state,
      country: p.country,
      phone: p.phone,
      fax: p.fax,
    }),
    [p],
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [picker, setPicker] = useState<Picker>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [chosen, setChosen] = useState<string[]>([]);

  const editing = draft !== null;
  const dirty = editing && JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const current = draft ?? saved;
  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d));
  const text = (key: Exclude<keyof Draft, 'manager' | 'secondaryOwners' | 'managerCanUpdate' | 'secondaryCanUpdate'>) => ({
    value: current[key],
    onChange: set(key),
    width: 280,
  });

  const users = useMemo(
    () => getSiblings(candidateNodeId).filter((o) => o.type === 'user' && o.id !== object.id),
    [getSiblings, candidateNodeId, object.id],
  );
  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((o) => !q || [o.name, o.description].some((v) => v.toLowerCase().includes(q)));
  }, [users, query]);
  const pageCount = Math.max(1, Math.ceil(candidates.length / PICKER_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const rows: DetailsRow[] = [
    ...(membershipFlags
      ? [{ label: 'Manager can update membership list', value: saved.manager ? (saved.managerCanUpdate ? 'Yes' : 'No') : 'Disabled until a manager is set' }]
      : []),
    { label: 'Office', value: shown(saved.office) },
    { label: 'Street address', value: shown(saved.street) },
    { label: 'City', value: shown(saved.city) },
    { label: 'State / Province', value: shown(saved.state) },
    { label: 'Country / Region', value: shown(saved.country) },
    { label: 'Telephone number', value: shown(saved.phone) },
    { label: 'Fax number', value: shown(saved.fax) },
    ...(membershipFlags ? [{ label: 'Secondary owners can update membership list', value: saved.secondaryCanUpdate ? 'Yes' : 'No' }] : []),
  ];

  const fields: FormInputProps[] = [
    ...(membershipFlags
      ? [
          {
            label: 'Manager can update membership list',
            checkbox: true,
            disabled: !current.manager,
            value: String(current.managerCanUpdate),
            onChange: (v: string) => set('managerCanUpdate')(v === 'true'),
          },
        ]
      : []),
    { label: 'Office', ...text('office') },
    { label: 'Street address', multiline: true, value: current.street, onChange: set('street') },
    { label: 'City', ...text('city') },
    { label: 'State / Province', ...text('state') },
    { label: 'Country / Region', ...text('country') },
    { label: 'Telephone number', ...text('phone') },
    { label: 'Fax number', ...text('fax') },
    ...(membershipFlags
      ? [
          {
            label: 'Secondary owners can update membership list',
            checkbox: true,
            value: String(current.secondaryCanUpdate),
            onChange: (v: string) => set('secondaryCanUpdate')(v === 'true'),
          },
        ]
      : []),
  ];

  const openPicker = (which: Exclude<Picker, null>) => {
    setQuery('');
    setPage(1);
    setChosen([]);
    setPicker(which);
  };

  const pick = (ids: string[]) => setChosen(picker === 'manager' ? ids.slice(-1) : ids);

  const savePicker = () => {
    const names = chosen.map((id) => users.find((u) => u.id === id)?.name ?? id);
    if (picker === 'manager') set('manager')(names[0] ?? current.manager);
    else set('secondaryOwners')([...new Set([...current.secondaryOwners, ...names])]);
    setPicker(null);
  };

  const cancel = () => requestLeave(() => setDraft(null));

  const save = () => {
    if (!draft) return;
    saveGroupProps(object.id, { ...draft, manager: draft.manager });
    setDraft(null);
    showToast(`Successfully updated ${objectLabel}`, {
      supportingText: `Successfully updated ownership for ${objectLabel} ${object.name}`,
    });
  };

  const person = (name: string) => ({ name });
  const state = editing ? (current.manager ? 'Edit mode' : 'Add manager') : 'Filled';

  return (
    <>
      <ARSManagedBy
        state={state}
        manager={current.manager ? [person(current.manager)] : []}
        owners={current.secondaryOwners.map(person)}
        rows={rows}
        fields={fields}
        onEdit={() => setDraft(saved)}
        onCancel={cancel}
        onSave={save}
        onAddManager={() => openPicker('manager')}
        onAddOwner={() => openPicker('owner')}
        onRemoveManager={() => set('manager')('')}
        onRemoveOwner={(who) => set('secondaryOwners')(current.secondaryOwners.filter((n) => n !== who.name))}
      />
      <ModalOverlay open={picker !== null} onClose={() => setPicker(null)} label={picker === 'manager' ? 'Add manager' : 'Add owner'}>
        <ARSAddMemberModal
          title={picker === 'manager' ? (current.manager ? 'Change manager' : 'Add manager') : 'Add owner'}
          found={candidates.length}
          rows={candidates.slice((safePage - 1) * PICKER_PAGE_SIZE, safePage * PICKER_PAGE_SIZE).map((o) => ({
            id: o.id,
            name: o.name,
            objectType: OBJECT_TYPE_META[o.type].label,
            description: o.description,
          }))}
          selectedIds={chosen}
          onSelectedIdsChange={pick}
          selectedItems={chosen.map((id) => ({ id, label: users.find((u) => u.id === id)?.name ?? id }))}
          search={query}
          onSearchChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          pagination={{ page: safePage, pageCount, onPageChange: setPage, pageSize: PICKER_PAGE_SIZE, pageSizeOptions: [PICKER_PAGE_SIZE] }}
          onClose={() => setPicker(null)}
          onCancel={() => setPicker(null)}
          onSave={savePicker}
        />
      </ModalOverlay>
    </>
  );
}
