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
import { GROUP_SCOPES, GROUP_TYPES, saveGroupProps, useGroupProps, type GroupProps } from '../../lib/groupDetailsStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { showToast } from '../../lib/toastStore.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useLeaveGuard } from '../../lib/useLeaveGuard.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { UnsavedChangesModal } from '../ObjectModals/UnsavedChangesModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import styles from './UserObjectPage.module.css';

/** The tabs as ARS_Group_Tabs draws them. */
export const GROUP_TABS = [
  'Overview',
  'General',
  'Ownership',
  'Memberships',
  'Managed units',
  'Roles/access templates',
  'Object details',
  'History',
];

const TAB_OVERVIEW = 'Overview';
const TAB_GENERAL = 'General';
const TAB_OWNERSHIP = 'Ownership';
const TAB_DETAILS = 'Object details';

/** Object Management as the group's Overview draws it. */
const GROUP_ACTIONS = [
  [{ label: 'Move' }, { label: 'Copy' }],
  [{ label: 'Deprovision', danger: true }, { label: 'Delete', danger: true }],
];

type Editing = typeof TAB_GENERAL | typeof TAB_OWNERSHIP | null;
type Draft = Record<string, string>;

const NOT_SET = 'Not set';
const shown = (value: string) => (value.trim() ? value : '-');

function generalDraft(object: DirectoryObject, p: GroupProps): Draft {
  return {
    displayName: object.name,
    groupName: p.groupName,
    description: object.description,
    resourceUrl: p.resourceUrl,
    keywords: p.keywords,
    email: p.email,
    scope: p.scope,
    type: p.type,
    tags: p.tags,
  };
}

function ownershipDraft(p: GroupProps): Draft {
  return {
    office: p.office,
    street: p.street,
    city: p.city,
    state: p.state,
    country: p.country,
    phone: p.phone,
    fax: p.fax,
    secondaryCanUpdate: String(p.secondaryCanUpdate),
  };
}

/** A stable share of `total`, so the sample member counts add up. */
function memberCounts(object: DirectoryObject) {
  const total = object.details.memberCount ?? 0;
  const users = Math.round(total * 0.68);
  const groups = Math.round(total * 0.17);
  const devices = Math.round(total * 0.11);
  return { total, users, groups, devices, others: Math.max(0, total - users - groups - devices), owners: 0 };
}

function overviewFor(object: DirectoryObject, p: GroupProps): ARSOverviewData {
  const c = memberCounts(object);
  return {
    profile: { name: object.name, email: p.email, badges: [{ label: 'Cloud', tone: 'neutral' }] },
    details: [
      [{ label: 'Membership type', value: `${p.type} Group` }],
      [{ label: 'Object ID', value: object.id }],
      [{ label: 'Created on', value: object.details.created ?? '-' }],
    ],
    stats: [
      { label: 'Total members', value: String(c.total) },
      { label: 'User(s)', value: String(c.users) },
      { label: 'Group(s)', value: String(c.groups) },
      { label: 'Device(s)', value: String(c.devices) },
      { label: 'Other(s)', value: String(c.others) },
      { label: 'Owner(s)', value: String(c.owners) },
    ],
  };
}

export interface GroupObjectPageProps {
  breadcrumb: Crumb[];
  object: DirectoryObject;
  /** Shown after the object class under the title. */
  location: string;
  onSave: (patch: { name: string; description: string }) => void;
  /** Called after the group is deleted and the delete modal is closed. */
  onDeleted: () => void;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  currentNodeId: string;
  canMoveTo: (destId: string) => boolean;
  onMove: (destId: string) => void;
}

/**
 * GroupObjectPage — a group's page (ARS_Group_Page_Overview): header, the
 * tabs of ARS_Group_Tabs, the Overview, the General, Ownership and Object
 * details cards, and Object Management.
 */
export function GroupObjectPage({
  breadcrumb,
  object,
  location,
  onSave,
  onDeleted,
  onBack,
  onPrevious,
  onNext,
  isFavorite,
  onToggleFavorite,
  currentNodeId,
  canMoveTo,
  onMove,
}: GroupObjectPageProps) {
  const { setAiOpen } = useAppShell();
  const pageMenu = useAnchoredMenu();
  const p = useGroupProps(object);
  const [tab, setTab] = useState(TAB_OVERVIEW);
  const [editing, setEditing] = useState<Editing>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [errors, setErrors] = useState<Draft>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const initial = useMemo(
    () => (editing === TAB_GENERAL ? generalDraft(object, p) : editing === TAB_OWNERSHIP ? ownershipDraft(p) : {}),
    [editing, object, p],
  );
  const dirty = editing !== null && JSON.stringify(draft) !== JSON.stringify(initial);

  const cancelEditing = () => {
    setEditing(null);
    setErrors({});
  };
  const guard = useLeaveGuard(dirty, cancelEditing);
  const { leave } = guard;

  // A different group starts from its own Overview.
  useEffect(() => {
    setTab(TAB_OVERVIEW);
    cancelEditing();
  }, [object.id]);

  const startEditing = (which: Exclude<Editing, null>) => {
    setDraft(which === TAB_GENERAL ? generalDraft(object, p) : ownershipDraft(p));
    setErrors({});
    setEditing(which);
  };

  const set = (key: string) => (value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: '' } : e));
  };

  const saveGeneral = () => {
    const next: Draft = {};
    if (!draft.displayName.trim()) next.displayName = 'Display name is required.';
    if (!draft.groupName.trim()) next.groupName = 'Group name (pre-Windows 2000) is required.';
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    onSave({ name: draft.displayName.trim(), description: draft.description });
    saveGroupProps(object.id, {
      groupName: draft.groupName.trim(),
      resourceUrl: draft.resourceUrl,
      keywords: draft.keywords,
      email: draft.email,
      scope: draft.scope,
      type: draft.type,
      tags: draft.tags,
    });
    cancelEditing();
    showToast('Successfully updated Group', {
      supportingText: `Successfully updated properties for Group ${draft.displayName.trim()}`,
    });
  };

  const saveOwnership = () => {
    saveGroupProps(object.id, {
      office: draft.office,
      street: draft.street,
      city: draft.city,
      state: draft.state,
      country: draft.country,
      phone: draft.phone,
      fax: draft.fax,
      secondaryCanUpdate: draft.secondaryCanUpdate === 'true',
    });
    cancelEditing();
    showToast('Successfully updated Group', {
      supportingText: `Successfully updated ownership for Group ${object.name}`,
    });
  };

  const generalRows: DetailsRow[] = [
    { label: 'Display name', value: object.name },
    { label: 'Group name (pre-Windows 2000)', value: p.groupName },
    { label: 'Description', value: shown(object.description) },
    { label: 'Resource URL', value: shown(p.resourceUrl) },
    { label: 'Keywords', value: shown(p.keywords) },
    { label: 'Email', value: shown(p.email) },
    { label: 'Group scope', value: p.scope },
    { label: 'Group type', value: p.type },
    { label: 'Tags', value: shown(p.tags) },
  ];

  const generalFields: (FormInputProps | FormInputProps[])[] = [
    { label: 'Display name', required: true, value: draft.displayName, onChange: set('displayName'), error: errors.displayName, width: 280 },
    { label: 'Group name (pre-Windows 2000)', required: true, value: draft.groupName, onChange: set('groupName'), error: errors.groupName, width: 280 },
    { label: 'Description', multiline: true, value: draft.description, onChange: set('description') },
    { label: 'Resource URL', value: draft.resourceUrl, onChange: set('resourceUrl'), width: 280 },
    { label: 'Keywords', value: draft.keywords, onChange: set('keywords'), width: 280 },
    { label: 'Email', value: draft.email, onChange: set('email'), width: 280 },
    { label: 'Group scope', radio: true, options: GROUP_SCOPES, value: draft.scope, onChange: set('scope') },
    { label: 'Group type', radio: true, options: GROUP_TYPES, value: draft.type, onChange: set('type') },
    { label: 'Tags', value: draft.tags, onChange: set('tags'), placeholder: 'Enter tags that describe this object.', width: 280 },
  ];

  const ownershipRows: DetailsRow[] = [
    { label: 'Manager', value: NOT_SET },
    { label: 'Manager can update membership list', value: 'Disabled until a manager is set' },
    { label: 'Office', value: shown(p.office) },
    { label: 'Street address', value: shown(p.street) },
    { label: 'City', value: shown(p.city) },
    { label: 'State / Province', value: shown(p.state) },
    { label: 'Country / Region', value: shown(p.country) },
    { label: 'Telephone number', value: shown(p.phone) },
    { label: 'Fax number', value: shown(p.fax) },
    { label: 'Secondary owners', value: NOT_SET },
    { label: 'Secondary owners can update membership list', value: p.secondaryCanUpdate ? 'Yes' : 'No' },
  ];

  const ownershipFields: (FormInputProps | FormInputProps[])[] = [
    { label: 'Manager', value: NOT_SET, disabled: true, width: 280 },
    { label: 'Manager can update membership list', checkbox: true, disabled: true, value: 'false' },
    { label: 'Office', value: draft.office, onChange: set('office'), width: 280 },
    { label: 'Street address', multiline: true, value: draft.street, onChange: set('street') },
    { label: 'City', value: draft.city, onChange: set('city'), width: 280 },
    { label: 'State / Province', value: draft.state, onChange: set('state'), width: 280 },
    { label: 'Country / Region', value: draft.country, onChange: set('country'), width: 280 },
    { label: 'Telephone number', value: draft.phone, onChange: set('phone'), width: 280 },
    { label: 'Fax number', value: draft.fax, onChange: set('fax'), width: 280 },
    { label: 'Secondary owners', value: NOT_SET, disabled: true, width: 280 },
    {
      label: 'Secondary owners can update membership list',
      checkbox: true,
      value: draft.secondaryCanUpdate,
      onChange: set('secondaryCanUpdate'),
    },
  ];

  const dn = `CN=${object.name},OU=Groups,DC=contoso,DC=com`;
  const detailRows: DetailsRow[] = [
    { label: 'Fully qualified domain name', value: dn },
    { label: 'Distinguished name', value: dn },
    { label: 'Object class', value: 'group' },
    { label: 'Created', value: object.details.created ?? '-' },
    { label: 'Modified', value: 'Jun 18, 2025 14:23:07 PM' },
    { label: 'Original USN', value: '131458' },
    { label: 'Current USN', value: '2847193' },
    { label: 'Object GUID', value: `{${object.id}}` },
    { label: 'Object SID', value: 'S-1-5-21-3623811015-3361044348-30300820-1013' },
    { label: 'Managed by', value: NOT_SET },
    { label: 'Protect from deletion', value: 'No' },
  ];

  const renderContent = () => {
    if (tab === TAB_OVERVIEW) return <ARSOverviewTemplate data={overviewFor(object, p)} />;
    if (tab === TAB_GENERAL) {
      return (
        <DetailsCard
          title="General"
          helper="Manage group name, type, and general properties."
          editing={editing === TAB_GENERAL}
          rows={generalRows}
          fields={generalFields}
          onEdit={() => startEditing(TAB_GENERAL)}
          onCancel={() => leave(cancelEditing)}
          onSave={saveGeneral}
        />
      );
    }
    if (tab === TAB_OWNERSHIP) {
      return (
        <DetailsCard
          title="Managed by"
          helper="Configure ownership and membership approval settings."
          editing={editing === TAB_OWNERSHIP}
          rows={ownershipRows}
          fields={ownershipFields}
          onEdit={() => startEditing(TAB_OWNERSHIP)}
          onCancel={() => leave(cancelEditing)}
          onSave={saveOwnership}
        />
      );
    }
    if (tab === TAB_DETAILS) {
      return (
        <DetailsCard
          title="Object details"
          helper="View technical LDAP object attributes."
          editing={false}
          rows={detailRows}
          actions={<></>}
        />
      );
    }
    return <EmptyFigure figure={Dish} label={tab} />;
  };

  const onAction = (label: string) => {
    if (label === 'Move') setMoveOpen(true);
    if (label === 'Delete') setDeleteOpen(true);
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <ARSUserPage
        title={object.name}
        icon="UsersThree"
        objectClass={`${p.type} Group`}
        objectName={location}
        tab={tab}
        tabs={GROUP_TABS}
        tabsLabel="Group sections"
        onTabChange={(next) => leave(() => setTab(next))}
        actionGroups={GROUP_ACTIONS}
        onBack={onBack}
        onNextItem={onNext}
        onPreviousItem={onPrevious}
        onMore={pageMenu.openAt}
        onAction={onAction}
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
        objectClass={OBJECT_TYPE_META.group.label}
        name={object.name}
        location={location}
        onDeleted={onDeleted}
      />
      <MoveObjectSheet
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        objects={[{ id: object.id, name: object.name }]}
        objectType={OBJECT_TYPE_META.group.label}
        currentNodeId={currentNodeId}
        canMoveTo={canMoveTo}
        onMove={(destId) => {
          setMoveOpen(false);
          leave(() => onMove(destId));
        }}
      />
      <UnsavedChangesModal open={guard.open} onCancel={guard.cancel} onConfirm={guard.confirm} />
    </AppShell>
  );
}
