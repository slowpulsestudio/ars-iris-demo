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
import { Dish } from '@lucasmarkes/hairline/react';
import { AppShell } from '../AppShell/AppShell.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { canMoveNode, getNodePath, removeNode, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useLeaveGuard } from '../../lib/useLeaveGuard.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { UnsavedChangesModal } from '../ObjectModals/UnsavedChangesModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { OwnershipTab } from '../ObjectPage/OwnershipTab.js';
import styles from '../ObjectPage/UserObjectPage.module.css';

/** The tabs as ARS_Header draws them on an OU's page. */
export const OU_TABS = ['Overview', 'General', 'Ownership', 'Roles', 'Object details', 'History'];

const TAB_OVERVIEW = 'Overview';
const TAB_GENERAL = 'General';
const TAB_OWNERSHIP = 'Ownership';
const TAB_DETAILS = 'Object details';

/** Object Management as the OU's Overview draws it. */
const OU_ACTIONS = [[{ label: 'Move' }], [{ label: 'Delete', danger: true }]];

type Draft = { description: string; street: string; city: string; state: string; zip: string; country: string };
const shown = (value: string) => (value.trim() ? value : '-');

export interface OUObjectPageProps {
  breadcrumb: Crumb[];
  /** The OU as a row of its parent folder; its id is the OU's own node id. */
  ou: DirectoryObject;
  onSave: (description: string) => void;
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
  const [tab, setTab] = useState(TAB_OVERVIEW);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [ownershipDirty, setOwnershipDirty] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const saved: Draft = useMemo(
    () => ({ description: ou.description, street: p.street, city: p.city, state: p.state, zip: p.zip, country: p.country }),
    [ou.description, p],
  );
  const dirty = ownershipDirty || (draft !== null && JSON.stringify(draft) !== JSON.stringify(saved));
  const guard = useLeaveGuard(dirty, () => {
    setOwnershipDirty(false);
    setDraft(null);
  });
  const { leave } = guard;

  useEffect(() => {
    setTab(TAB_OVERVIEW);
    setDraft(null);
  }, [ou.id]);

  const path = getNodePath(ou.id).map((n) => n.name);
  const location = path.slice(0, -1).join(' / ');
  const children = getChildren(ou.id);
  const count = (pick: (o: DirectoryObject) => boolean) => String(children.filter(pick).length);

  const overview: ARSOverviewData = {
    stats: [
      { label: 'Total Objects', value: String(children.length) },
      { label: 'Users', value: count((o) => o.type === 'user') },
      { label: 'Groups', value: count((o) => o.type === 'group') },
      { label: 'Organizational Units', value: count((o) => o.type === 'ou') },
      { label: 'Other Objects', value: count((o) => !['user', 'group', 'ou'].includes(o.type)) },
    ],
  };

  const set = (key: keyof Draft) => (value: string) => setDraft((d) => (d ? { ...d, [key]: value } : d));
  const current = draft ?? saved;

  const generalRows: DetailsRow[] = [
    { label: 'Description', value: shown(saved.description) },
    { label: 'Street address', value: shown(saved.street) },
    { label: 'City', value: shown(saved.city) },
    { label: 'State/Province', value: shown(saved.state) },
    { label: 'Zip/Postal Code', value: shown(saved.zip) },
    { label: 'Country/Region', value: shown(saved.country) },
  ];
  const generalFields: FormInputProps[] = [
    { label: 'Description', multiline: true, value: current.description, onChange: set('description') },
    { label: 'Street address', multiline: true, value: current.street, onChange: set('street') },
    { label: 'City', value: current.city, onChange: set('city'), width: 280 },
    { label: 'State/Province', value: current.state, onChange: set('state'), width: 280 },
    { label: 'Zip/Postal Code', value: current.zip, onChange: set('zip'), width: 280 },
    { label: 'Country/Region', value: current.country, onChange: set('country'), width: 280 },
  ];

  const saveGeneral = () => {
    if (!draft) return;
    onSave(draft.description);
    saveGroupProps(ou.id, { street: draft.street, city: draft.city, state: draft.state, zip: draft.zip, country: draft.country });
    setDraft(null);
    showToast('Successfully updated Organizational Unit', {
      supportingText: `Successfully updated properties for Organizational Unit ${ou.name}`,
    });
  };

  const dn = `OU=${ou.name},${path
    .slice(0, -1)
    .reverse()
    .map((n) => `OU=${n}`)
    .join(',')}`;
  const detailRows: DetailsRow[] = [
    { label: 'Fully qualified domain name of the object', value: ou.name },
    { label: 'Distinguished name', value: dn },
    { label: 'Object class', value: 'organizationalUnit' },
    { label: 'Created', value: ou.details.created ?? '-' },
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
          editing={draft !== null}
          rows={generalRows}
          fields={generalFields}
          onEdit={() => setDraft(saved)}
          onCancel={() => leave(() => setDraft(null))}
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
      return <DetailsCard title="Properties" helper="View technical LDAP object attributes." editing={false} rows={detailRows} actions={<></>} />;
    }
    return <EmptyFigure figure={Dish} label={tab} />;
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <ARSUserPage
        title={ou.name}
        icon="Folder"
        objectClass="Organizational Unit"
        objectName={location}
        tab={tab}
        tabs={OU_TABS}
        tabsLabel="Organizational unit sections"
        onTabChange={(next) => leave(() => setTab(next))}
        actionGroups={OU_ACTIONS}
        onBack={onBack}
        onMore={pageMenu.openAt}
        onAction={(label) => {
          if (label === 'Move') setMoveOpen(true);
          if (label === 'Delete') setDeleteOpen(true);
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
        onClose={() => setDeleteOpen(false)}
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
        onClose={() => setMoveOpen(false)}
        objects={[{ id: ou.id, name: ou.name }]}
        objectType="Organizational Unit"
        currentNodeId={ou.parentId}
        canMoveTo={(destId) => canMoveNode(ou.id, destId)}
        onMove={(destId) => {
          setMoveOpen(false);
          leave(() => onMoved(destId));
        }}
      />
      <UnsavedChangesModal open={guard.open} onCancel={guard.cancel} onConfirm={guard.confirm} />
    </AppShell>
  );
}
