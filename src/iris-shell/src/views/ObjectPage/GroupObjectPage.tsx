import { useEffect, useMemo, useState } from 'react';
import {
  ARSDeprovisionGroup,
  ARSGroupOverview,
  ARSPageMenu,
  ARSRenameGroup,
  ARSUserPage,
  DetailsCard,
  type DetailsRow,
  type FormInputProps,
} from '@ars';
import { Dish } from '@lucasmarkes/hairline/react';
import { AppShell } from '../AppShell/AppShell.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { setHashParams, useHashParam, useHashTab } from '../../lib/hashState.js';
import { GROUP_SCOPES, GROUP_TYPES, saveGroupProps, useGroupProps, type GroupProps } from '../../lib/groupDetailsStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { showToast } from '../../lib/toastStore.js';
import { copyObject } from '../../lib/copyObject.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useLeaveGuard } from '../../lib/useLeaveGuard.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { UnsavedChangesModal } from '../ObjectModals/UnsavedChangesModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { GroupMembersTab } from './GroupMembersTab.js';
import { OwnershipTab } from './OwnershipTab.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
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

/** Object Management as the group's Overview draws it, with Rename added from the written requirements. */
const GROUP_ACTIONS = [
  [{ label: 'Rename' }, { label: 'Move' }, { label: 'Copy' }],
  [{ label: 'Deprovision', danger: true }, { label: 'Delete', danger: true }],
];

type Editing = typeof TAB_GENERAL | null;
type Draft = Record<string, string>;

const NOT_SET = 'Not set';
/** Tooltip for Figma's info icons, which carry no text (as in the New object form). */
const INFO = 'More information';
/** Figma's "0/100" on the Description field. */
const DESCRIPTION_LIMIT = 100;
const shown = (value: string) => (value.trim() ? value : '-');

/** Figma writes dates as "Jan 12, 2024"; the sample data stores "2024-01-12". */
function figmaDate(iso: string | undefined): string {
  if (!iso) return '-';
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

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

/** A stable share of `total`, so the sample member counts add up. */
function memberCounts(object: DirectoryObject, p: GroupProps) {
  const total = (object.details.memberCount ?? 0) + p.addedMembers.length;
  const users = Math.round(total * 0.68);
  const groups = Math.round(total * 0.17);
  const devices = Math.round(total * 0.11);
  const owners = (p.manager ? 1 : 0) + p.secondaryOwners.length;
  return { total, users, groups, devices, others: Math.max(0, total - users - groups - devices), owners };
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
  // The tab, the card being edited and the open dialog live in the address (?tab=general&edit=general&dialog=rename).
  const [tab, setTab] = useHashTab(GROUP_TABS);
  const [editParam] = useHashParam('edit');
  const [dialog] = useHashParam('dialog');
  const editing: Editing = editParam === 'general' ? TAB_GENERAL : null;
  const deleteOpen = dialog === 'delete';
  const moveOpen = dialog === 'move';
  const copyOpen = dialog === 'copy';
  const deprovisionOpen = dialog === 'deprovision';
  const renameOpen = dialog === 'rename';
  const closeDialog = () => setHashParams({ dialog: null });
  // Unsaved changes in the Ownership card.
  const [ownershipDirty, setOwnershipDirty] = useState(false);
  const [draft, setDraft] = useState<Draft>({});
  const [errors, setErrors] = useState<Draft>({});
  const [renameDraft, setRenameDraft] = useState({ name: '', groupName: '' });
  const [renameErrors, setRenameErrors] = useState({ name: '', groupName: '' });
  const { getNodeName } = useDirectory();

  const initial = useMemo(
    () => (editing === TAB_GENERAL ? generalDraft(object, p) : {}),
    [editing, object, p],
  );
  const dirty = ownershipDirty || (editing !== null && JSON.stringify(draft) !== JSON.stringify(initial));

  const cancelEditing = () => {
    setHashParams({ edit: null });
    setErrors({});
  };
  const guard = useLeaveGuard(dirty, () => {
    setOwnershipDirty(false);
    cancelEditing();
  });
  const { leave } = guard;

  // A different group, or a form or dialog opened by an address, starts from the saved values.
  useEffect(() => {
    if (editing === TAB_GENERAL) setDraft(generalDraft(object, p));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.id, editing]);
  useEffect(() => {
    if (!renameOpen) return;
    setRenameDraft({ name: object.name, groupName: p.groupName });
    setRenameErrors({ name: '', groupName: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renameOpen, object.id]);

  const startEditing = (which: Exclude<Editing, null>) => {
    setDraft(generalDraft(object, p));
    setErrors({});
    setHashParams({ tab: 'general', edit: 'general', dialog: null });
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
    { label: 'Display name', required: true, info: INFO, value: draft.displayName, onChange: set('displayName'), error: errors.displayName, width: 280 },
    { label: 'Group name (pre-Windows 2000)', required: true, info: INFO, value: draft.groupName, onChange: set('groupName'), error: errors.groupName, width: 280 },
    { label: 'Description', multiline: true, maxLength: DESCRIPTION_LIMIT, value: draft.description, onChange: set('description'), width: 280 },
    { label: 'Resource URL', placeholder: 'Resource URL', value: draft.resourceUrl, onChange: set('resourceUrl'), width: 280 },
    { label: 'Keywords', placeholder: 'Keywords', value: draft.keywords, onChange: set('keywords'), width: 280 },
    { label: 'Email', placeholder: 'Email', value: draft.email, onChange: set('email'), width: 280 },
    { label: 'Group scope', radio: true, options: GROUP_SCOPES, value: draft.scope, onChange: set('scope') },
    { label: 'Group type', radio: true, options: GROUP_TYPES, value: draft.type, onChange: set('type') },
    { label: 'Tags', multiline: true, help: 'Enter tags that describe this object.', value: draft.tags, onChange: set('tags'), width: 280 },
  ];

  const dn = `CN=${object.name},OU=Groups,DC=contoso,DC=com`;
  const detailRows: DetailsRow[] = [
    { label: 'Fully qualified domain name', value: dn },
    { label: 'Distinguished name', value: dn },
    { label: 'Object class', value: 'group' },
    { label: 'Created', value: figmaDate(object.details.created) },
    { label: 'Modified', value: 'Jun 18, 2025 14:23:07 PM' },
    { label: 'Original USN', value: '131458' },
    { label: 'Current USN', value: '2847193' },
    { label: 'Object GUID', value: `{${object.id}}` },
    { label: 'Object SID', value: 'S-1-5-21-3623811015-3361044348-30300820-1013' },
    { label: 'Managed by', value: p.manager || NOT_SET },
    { label: 'Protect from deletion', value: p.protect ? 'Yes' : 'No' },
  ];

  const renderContent = () => {
    if (tab === TAB_OVERVIEW) {
      return (
        <ARSGroupOverview
          name={object.name}
          membershipType={`${p.type} Group`}
          source="Cloud"
          objectId={object.id}
          createdOn={figmaDate(object.details.created)}
          email={shown(p.email)}
          badges={p.deprovisioned ? [{ label: 'Deprovisioned', tone: 'warning' }] : []}
          counts={memberCounts(object, p)}
          onCopyName={() => {
            void navigator.clipboard?.writeText(object.name);
            showToast('Name copied');
          }}
          onOpenMembers={() => setTab('Memberships')}
        />
      );
    }
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
        <OwnershipTab
          key={object.id}
          object={object}
          candidateNodeId={currentNodeId}
          objectLabel="Group"
          membershipFlags
          helper="Configure ownership and membership approval settings."
          onDirtyChange={setOwnershipDirty}
          requestLeave={leave}
        />
      );
    }
    if (tab === 'Memberships') return <GroupMembersTab key={object.id} group={object} nodeId={currentNodeId} />;
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
    if (label === 'Rename') leave(() => setHashParams({ dialog: 'rename' }));
    if (label === 'Move') setHashParams({ dialog: 'move' });
    if (label === 'Copy') setHashParams({ dialog: 'copy' });
    if (label === 'Deprovision') setHashParams({ dialog: 'deprovision' });
    if (label === 'Delete') setHashParams({ dialog: 'delete' });
  };

  const rename = () => {
    const next = {
      name: renameDraft.name.trim() ? '' : 'Name is required.',
      groupName: renameDraft.groupName.trim() ? '' : 'Group name (Pre-Windows 2000) is required.',
    };
    setRenameErrors(next);
    if (next.name || next.groupName) return;
    onSave({ name: renameDraft.name.trim(), description: object.description });
    saveGroupProps(object.id, { groupName: renameDraft.groupName.trim() });
    closeDialog();
    showToast('Successfully renamed Group', { supportingText: `Group renamed to ${renameDraft.name.trim()}` });
  };

  const deprovision = () => {
    closeDialog();
    saveGroupProps(object.id, { deprovisioned: true });
    showToast(`Group ${object.name} deprovisioned successfully.`, {
      onUndo: () => saveGroupProps(object.id, { deprovisioned: false }),
    });
  };

  const copyTo = (destId: string) => {
    closeDialog();
    const result = copyObject(currentNodeId, object.id, destId);
    if (!result) return;
    saveGroupProps(result.copy.id, { ...p, groupName: result.copy.name });
    showToast(`Group ${object.name} copied to ${getNodeName(destId) ?? 'the folder'} successfully.`, {
      onUndo: result.undo,
      viewHref: `#/tree/${destId}/${result.copy.id}`,
      viewLabel: 'View object',
    });
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
        onClose={closeDialog}
        objectClass={OBJECT_TYPE_META.group.label}
        name={object.name}
        location={location}
        onDeleted={onDeleted}
      />
      <MoveObjectSheet
        open={moveOpen}
        onClose={closeDialog}
        objects={[{ id: object.id, name: object.name }]}
        objectType={OBJECT_TYPE_META.group.label}
        currentNodeId={currentNodeId}
        canMoveTo={canMoveTo}
        onMove={(destId) => {
          closeDialog();
          leave(() => onMove(destId));
        }}
      />
      <UnsavedChangesModal open={guard.open} onCancel={guard.cancel} onConfirm={guard.confirm} />
      <MoveObjectSheet
        open={copyOpen}
        mode="copy"
        onClose={closeDialog}
        objects={[{ id: object.id, name: object.name }]}
        objectType={OBJECT_TYPE_META.group.label}
        currentNodeId={currentNodeId}
        canMoveTo={() => true}
        onMove={copyTo}
      />
      <ModalOverlay open={renameOpen} onClose={closeDialog} label="Rename Group">
        <ARSRenameGroup
          name={renameDraft.name}
          onNameChange={(name) => setRenameDraft((d) => ({ ...d, name }))}
          groupName={renameDraft.groupName}
          onGroupNameChange={(groupName) => setRenameDraft((d) => ({ ...d, groupName }))}
          nameError={renameErrors.name}
          groupNameError={renameErrors.groupName}
          onClose={closeDialog}
          onCancel={closeDialog}
          onRename={rename}
        />
      </ModalOverlay>
      <ModalOverlay open={deprovisionOpen} onClose={closeDialog} label="Deprovision AD Group">
        <ARSDeprovisionGroup
          name={object.name}
          onClose={closeDialog}
          onNo={closeDialog}
          onYes={deprovision}
        />
      </ModalOverlay>
    </AppShell>
  );
}
