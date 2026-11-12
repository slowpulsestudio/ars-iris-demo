import { useEffect, useMemo, useState } from 'react';
import {
  ARSOverviewTemplate,
  ARSPageMenu,
  ARSUserPage,
  DetailsCard,
  type ARSOverviewData,
  type DetailsRow,
  type FormInputProps,
} from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { setHashParams, useHashParam, useHashTab } from '../../lib/hashState.js';
import { canMoveNode, getNodePath, removeNode, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useLeaveGuard } from '../../lib/useLeaveGuard.js';
import { ComingSoon } from '../ComingSoon/ComingSoon.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { UnsavedChangesModal } from '../ObjectModals/UnsavedChangesModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { OwnershipTab } from '../ObjectPage/OwnershipTab.js';
import styles from '../ObjectPage/UserObjectPage.module.css';

/** The tabs as ARS_Header draws them on an OU's page. */
export const OU_TABS = ['Overview', 'General', 'Ownership', 'Managed units', 'Roles', 'Object details', 'History'];

const TAB_OVERVIEW = 'Overview';
const TAB_GENERAL = 'General';
const TAB_OWNERSHIP = 'Ownership';
const TAB_DETAILS = 'Object details';

/** Object Management as the OU's Overview draws it. */
const OU_ACTIONS = [[{ label: 'Move' }], [{ label: 'Delete', danger: true }]];

type Draft = { name: string; description: string; street: string; city: string; state: string; zip: string; country: string };
const shown = (value: string) => (value.trim() ? value : '-');

/** Figma writes "Friday, November 7, 2025 …"; the sample data stores "2025-11-07" with no time. */
function longDate(iso: string | undefined): string {
  if (!iso) return '-';
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export interface OUObjectPageProps {
  breadcrumb: Crumb[];
  /** The OU as a row of its parent folder; its id is the OU's own node id. */
  ou: DirectoryObject;
  onSave: (patch: { name: string; description: string }) => void;
  onBack: () => void;
  /** Called with the folder the OU moved to. */
  onMoved: (destId: string) => void;
  onDeleted: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * OUObjectPage — an organizational unit's page: Overview, General, Ownership,
 * Object details, and Move and Delete in Object Management (the Iris UI page
 * of ARS_WebUI2_OU_Management).
 */
export function OUObjectPage({ breadcrumb, ou, onSave, onBack, onMoved, onDeleted, onToggleFavorite }: OUObjectPageProps) {
  const { setAiOpen } = useAppShell();
  const { getChildren } = useDirectory();
  const pageMenu = useAnchoredMenu();
  const p = useGroupProps(ou);
  // The tab, the form being edited and the open dialog live in the address (?tab=general&edit=general&dialog=delete).
  const [tab, setTab] = useHashTab(OU_TABS);
  const [editParam] = useHashParam('edit');
  const [dialog] = useHashParam('dialog');
  const editing = editParam === 'general';
  const deleteOpen = dialog === 'delete';
  const moveOpen = dialog === 'move';
  const closeDialog = () => setHashParams({ dialog: null });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [nameError, setNameError] = useState('');
  const [ownershipDirty, setOwnershipDirty] = useState(false);

  const saved: Draft = useMemo(
    () => ({
      name: ou.name,
      description: ou.description,
      street: p.street,
      city: p.city,
      state: p.state,
      zip: p.zip,
      country: p.country,
    }),
    [ou.name, ou.description, p],
  );
  const dirty = ownershipDirty || (draft !== null && JSON.stringify(draft) !== JSON.stringify(saved));
  const guard = useLeaveGuard(dirty, () => {
    setOwnershipDirty(false);
    setHashParams({ edit: null });
  });
  const { leave } = guard;

  // A different OU, or editing opened by an address, starts the form from the saved values.
  useEffect(() => {
    setDraft(editing ? saved : null);
    setNameError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ou.id, editing]);

  const path = getNodePath(ou.id).map((n) => n.name);
  // Figma's header writes the location from the directory down, e.g. "O1D.local" (the first two levels are tree folders).
  const location = path.slice(2, -1).join('\\');
  const children = getChildren(ou.id);
  const count = (pick: (o: DirectoryObject) => boolean) => String(children.filter(pick).length);

  // OU Overview (1131:10263): four tiles, then the "Other Objects" strip with these four types.
  const overview: ARSOverviewData = {
    stats: [
      { label: 'Total Objects', value: String(children.length) },
      { label: 'Users', value: count((o) => o.type === 'user') },
      { label: 'Groups', value: count((o) => o.type === 'group') },
      { label: 'Organizational Units', value: count((o) => o.type === 'ou') },
    ],
    // The sample data has no shared folders or printers.
    othersTitle: 'Other Objects',
    others: [
      { label: 'Shared folders', value: '0' },
      { label: 'Contacts', value: count((o) => o.type === 'contact') },
      { label: 'Printers', value: '0' },
      { label: 'GMSAs', value: count((o) => o.type === 'gmsa') },
    ],
  };

  const set = (key: keyof Draft) => (value: string) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    if (key === 'name') setNameError('');
  };
  const current = draft ?? saved;

  // Labels and widths as "Organizational Unit - Properties [General]" (1065:6047) and its Edit (1069:7492) draw them.
  const generalRows: DetailsRow[] = [
    { label: 'Name', value: saved.name },
    { label: 'Description', value: shown(saved.description) },
    { label: 'Street address', value: shown(saved.street) },
    { label: 'City', value: shown(saved.city) },
    { label: 'State/province', value: shown(saved.state) },
    { label: 'ZIP/postal code', value: shown(saved.zip) },
    { label: 'Country/region', value: shown(saved.country) },
  ];
  const generalFields: (FormInputProps | FormInputProps[])[] = [
    { label: 'Name', value: current.name, onChange: set('name'), error: nameError, width: 576 },
    { label: 'Description', multiline: true, value: current.description, onChange: set('description'), width: 576 },
    [
      { label: 'Street address', value: current.street, onChange: set('street'), width: 280 },
      { label: 'City', value: current.city, onChange: set('city'), width: 280 },
    ],
    [
      { label: 'State/province', value: current.state, onChange: set('state'), width: 280 },
      { label: 'ZIP/postal code', value: current.zip, onChange: set('zip'), width: 280 },
    ],
    { label: 'Country/region', value: current.country, onChange: set('country'), width: 280 },
  ];

  const saveGeneral = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setNameError('Name is required.');
      return;
    }
    onSave({ name: draft.name.trim(), description: draft.description });
    saveGroupProps(ou.id, { street: draft.street, city: draft.city, state: draft.state, zip: draft.zip, country: draft.country });
    setHashParams({ edit: null });
    showToast('Successfully updated Organizational Unit', {
      supportingText: `Successfully updated properties for Organizational Unit ${draft.name.trim()}`,
    });
  };

  // Figma: "OU=Test OU,DC=roles2,DC=net" — the OUs up to the domain, then the domain's parts (path[2] is the domain).
  const dn = [
    ...path.slice(3).reverse().map((n) => `OU=${n}`),
    ...(path[2] ?? '').split('.').filter(Boolean).map((part) => `DC=${part}`),
  ].join(',');
  const detailRows: DetailsRow[] = [
    { label: 'Fully qualified domain name of the object', value: ou.name },
    { label: 'Distinguished name', value: dn },
    { label: 'Object class', value: 'organizationalUnit' },
    { label: 'Created', value: longDate(ou.details.created) },
    { label: 'Modified', value: '-' },
    { label: 'Original USN', value: '1234567890123' },
    { label: 'Current USN', value: '1234567890132' },
    { label: 'Object GUID', value: ou.id },
    { label: 'Object SID', value: '-' },
    { label: 'Managed', value: p.manager ? 'Yes' : 'No' },
    { label: 'Protect object from accidental deletion', value: p.protect ? 'Yes' : 'No' },
  ];

  const renderContent = () => {
    if (tab === TAB_OVERVIEW) return <ARSOverviewTemplate variant="OU" data={overview} />;
    if (tab === TAB_GENERAL) {
      return (
        <DetailsCard
          title="General"
          helper="Manage general information."
          editing={editing}
          rows={generalRows}
          fields={generalFields}
          onEdit={() => {
            setNameError('');
            setHashParams({ tab: 'general', edit: 'general' });
          }}
          onCancel={() => leave(() => setHashParams({ edit: null }))}
          onSave={saveGeneral}
        />
      );
    }
    if (tab === TAB_OWNERSHIP) {
      return (
        <OwnershipTab
          key={ou.id}
          object={ou}
          candidateNodeId={ou.id}
          objectLabel="Organizational Unit"
          onDirtyChange={setOwnershipDirty}
          requestLeave={leave}
        />
      );
    }
    if (tab === TAB_DETAILS) {
      return <DetailsCard title="Properties" editing={false} rows={detailRows} actions={<></>} />;
    }
    return <ComingSoon label={tab} />;
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <ARSUserPage
        title={ou.name}
        icon="Folder"
        objectClass="Organizational unit"
        objectName={location}
        tab={tab}
        tabs={OU_TABS}
        tabsLabel="Organizational unit sections"
        onTabChange={(next) => leave(() => setTab(next))}
        actionGroups={OU_ACTIONS}
        onBack={onBack}
        onMore={pageMenu.openAt}
        onAction={(label) => {
          if (label === 'Move') setHashParams({ dialog: 'move' });
          if (label === 'Delete') setHashParams({ dialog: 'delete' });
        }}
      >
        <div className={styles.stack}>{renderContent()}</div>
      </ARSUserPage>

      <ARSPageMenu
        {...pageMenu.menuProps}
        onAction={(label) => {
          if (label === 'Add to Favorites') onToggleFavorite();
          if (label === 'Ask AI') setAiOpen(true);
        }}
      />
      <DeleteObjectModal
        open={deleteOpen}
        onClose={closeDialog}
        objectClass="Organizational Unit"
        name={ou.name}
        location={location}
        onDeleted={() => {
          removeNode(ou.id);
          onDeleted();
        }}
      />
      <MoveObjectSheet
        open={moveOpen}
        onClose={closeDialog}
        objects={[{ id: ou.id, name: ou.name }]}
        objectType="Organizational Unit"
        currentNodeId={ou.parentId}
        canMoveTo={(destId) => canMoveNode(ou.id, destId)}
        onMove={(destId) => {
          closeDialog();
          leave(() => onMoved(destId));
        }}
      />
      <UnsavedChangesModal open={guard.open} onCancel={guard.cancel} onConfirm={guard.confirm} />
    </AppShell>
  );
}
