import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ARSOverviewTemplate,
  ARSPageMenu,
  ARSUserPage,
  DetailsCard,
  USER_OBJECT_ACTIONS,
  USER_PAGE_TABS,
  type ARSOverviewData,
  type DetailsRow,
  type FormInputProps,
} from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { setHashParams, useHashParam, useHashTab } from '../../lib/hashState.js';
import { navigate, setNavigationGuard } from '../../lib/router.js';
import { showToast } from '../../lib/toastStore.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { Banner } from '../../components/Banner/Banner.js';
import { Button } from '../../components/Button/Button.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import { Dish } from '@lucasmarkes/hairline/react';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { ResetPasswordModal } from '../ObjectModals/ResetPasswordModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { UnsavedChangesModal } from '../ObjectModals/UnsavedChangesModal.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { UserDetailsTab } from './UserDetailsTab.js';
import { useLeaveGuard } from '../../lib/useLeaveGuard.js';
import styles from './UserObjectPage.module.css';

/** What the page shows and edits for a user, whichever store it comes from. */
export interface UserObjectData {
  id: string;
  /** Full name. */
  name: string;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  description: string;
  /** The part of the user principal name before the directory. */
  login: string;
  /** The directory, with its "@", e.g. "@Entra1". */
  directory: string;
  email: string;
  status: string;
  objectId: string;
  /** Shown after the object class under the title. */
  location: string;
}

export interface UserObjectPatch {
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  description: string;
  login: string;
  directory: string;
}

export const USER_DIRECTORIES = ['@Entra1', '@O1D.Local'];

const TAB_OVERVIEW = 'Overview';
const TAB_GENERAL = 'General';
const TAB_DETAILS = 'User Details';

type Draft = UserObjectPatch;
type Errors = Partial<Record<keyof Draft, string>>;

const REQUIRED: { key: keyof Draft; label: string }[] = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'displayName', label: 'Display name' },
  { key: 'login', label: 'User principal name' },
  { key: 'directory', label: 'Directory' },
];

function toDraft(data: UserObjectData): Draft {
  const { firstName, lastName, displayName, initials, description, login, directory } = data;
  return { firstName, lastName, displayName, initials, description, login, directory };
}

/** Stable pseudo-counts for the overview tiles, since the data has none. */
function tileCount(id: string, salt: number, max: number): string {
  let h = salt;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return String(h % max);
}

/** The totals shown on the Overview cards and on the Memberships and Roles tab labels, so they always agree. */
function userCounts(id: string): { memberships: string; roles: string } {
  return { memberships: tileCount(id, 3, 40), roles: tileCount(id, 7, 8) };
}

/** The user tabs with this user's totals: Figma's "Memberships (8)" is a sample count. */
function userTabs(counts: { memberships: string; roles: string }): string[] {
  return USER_PAGE_TABS.map((t) =>
    t.startsWith('Memberships') ? `Memberships (${counts.memberships})` : t === 'Roles' ? `Roles (${counts.roles})` : t,
  );
}

/** `openTab` opens the tab a card's number counts, by its label without the count. */
function overviewFor(data: UserObjectData, openTab: (name: 'Memberships' | 'Roles') => void): ARSOverviewData {
  const counts = userCounts(data.id);
  return {
    profile: {
      name: data.name,
      email: data.email,
      badges: [
        { label: 'Member', tone: 'neutral' },
        { label: data.status, tone: data.status.toLowerCase() === 'active' ? 'success' : 'neutral' },
      ],
    },
    details: [
      [{ label: 'User principal name', value: `${data.login}${data.directory}` }],
      [{ label: 'Object ID', value: data.objectId }],
      [
        { label: 'Created on', value: '12 Jan, 2024' },
        { label: 'Last sign-in', value: '12 Jan, 2024' },
      ],
    ],
    stats: [
      { label: 'Group memberships', value: counts.memberships, onClick: () => openTab('Memberships') },
      { label: 'Applications', value: tileCount(data.id, 5, 40) },
      { label: 'Assigned roles', value: counts.roles, onClick: () => openTab('Roles') },
      { label: 'Assigned licenses', value: tileCount(data.id, 11, 8) },
    ],
  };
}

export interface UserObjectPageProps {
  breadcrumb: Crumb[];
  data: UserObjectData;
  /** Whether another user already has this user principal name. */
  isLogonTaken: (login: string, directory: string) => boolean;
  onSave: (patch: UserObjectPatch) => void;
  /** Called after the user is deleted and the delete modal is closed. */
  onDeleted: () => void;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /** Folder to open the Move side sheet at; omit for a user outside the tree. */
  currentNodeId?: string | null;
  /** Whether the user can move to the folder `destId`. */
  canMoveTo: (destId: string) => boolean;
  /** Called when the user chooses Move in the side sheet. */
  onMove: (destId: string) => void;
}

/**
 * UserObjectPage — a user's page (ARS_User_Page): header, tabs, the Overview
 * (ARS_Overview_Template) or the Properties card in read or edit mode, and
 * Object Management.
 */
export function UserObjectPage({
  breadcrumb,
  data,
  isLogonTaken,
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
}: UserObjectPageProps) {
  const { setAiOpen } = useAppShell();
  const pageMenu = useAnchoredMenu();
  // The tab, the card being edited and the open dialog live in the address (?tab=general&edit=general&dialog=delete).
  const counts = userCounts(data.id);
  const tabs = useMemo(() => userTabs(counts), [counts.memberships, counts.roles]);
  const [tab, setTab] = useHashTab(tabs);
  const [editParam] = useHashParam('edit');
  const [dialog] = useHashParam('dialog');
  const editing = editParam === 'general';
  const resetOpen = dialog === 'reset-password';
  const deleteOpen = dialog === 'delete';
  const moveOpen = dialog === 'move';
  const closeDialog = () => setHashParams({ dialog: null });
  const [draft, setDraft] = useState<Draft>(() => toDraft(data));
  const [errors, setErrors] = useState<Errors>({});
  const [bannerOpen, setBannerOpen] = useState(false);
  // Unsaved changes in the User Details cards.
  const [detailsDirty, setDetailsDirty] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const dirty = detailsDirty || (editing && JSON.stringify(draft) !== JSON.stringify(toDraft(data)));
  const directoryName = data.directory.replace(/^@/, '');

  // Leaving a form with changes asks first.
  const guard = useLeaveGuard(dirty, () => {
    setDetailsDirty(false);
    cancelEditing();
  });
  const { leave } = guard;

  // A different object, or editing opened by an address, starts the form from the saved values.
  useEffect(() => {
    setDraft(toDraft(data));
    setErrors({});
    setBannerOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, editing]);

  const startEditing = () => {
    setDraft(toDraft(data));
    setErrors({});
    setBannerOpen(false);
    setHashParams({ tab: 'general', edit: 'general', dialog: null });
  };

  const cancelEditing = () => {
    setHashParams({ edit: null });
    setErrors({});
    setBannerOpen(false);
  };

  // ⌘E / Ctrl+E starts editing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || !(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'e') return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      e.preventDefault();
      startEditing();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const save = () => {
    const next: Errors = {};
    for (const { key, label } of REQUIRED) {
      if (!draft[key].trim()) next[key] = `${label} is required.`;
    }
    if (!next.login && !next.directory && isLogonTaken(draft.login.trim(), draft.directory)) {
      next.login = 'User logon name already exists.';
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      setBannerOpen(true);
      return;
    }
    onSave({
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      displayName: draft.displayName.trim(),
      initials: draft.initials.trim(),
      description: draft.description,
      login: draft.login.trim(),
      directory: draft.directory,
    });
    cancelEditing();
    showToast('Successfully updated User', {
      supportingText: `Successfully updated properties for User ${draft.displayName.trim()}`,
      viewHref: window.location.hash,
    });
  };

  // View: take the user to the first field with an error.
  const locateError = () => {
    const field = cardRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    field?.scrollIntoView({ block: 'center' });
    field?.focus();
  };

  const set = (key: keyof Draft) => (value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const rows: DetailsRow[] = [
    { label: 'First name', value: data.firstName },
    { label: 'Last name', value: data.lastName },
    { label: 'Display name', value: data.displayName },
    { label: 'User principal name', value: `${data.login}${data.directory}` },
    { label: 'Authorization information' },
    { label: 'Description', value: data.description },
  ];

  const fields: (FormInputProps | FormInputProps[])[] = [
    [
      { label: 'First name', required: true, value: draft.firstName, onChange: set('firstName'), error: errors.firstName, width: 280 },
      { label: 'Last name', required: true, value: draft.lastName, onChange: set('lastName'), error: errors.lastName, width: 280 },
    ],
    { label: 'Display name', required: true, value: draft.displayName, onChange: set('displayName'), error: errors.displayName, width: 280 },
    [
      { label: 'User principal name', required: true, value: draft.login, onChange: set('login'), error: errors.login, width: 280 },
      {
        label: 'Directory',
        required: true,
        select: true,
        options: USER_DIRECTORIES,
        value: draft.directory,
        onChange: set('directory'),
        error: errors.directory,
        width: 140,
      },
    ],
    { label: 'Initials', value: draft.initials, onChange: set('initials'), width: 70 },
    { label: 'Description', multiline: true, value: draft.description, onChange: set('description') },
  ];

  const hasErrors = Object.values(errors).some(Boolean);

  const renderContent = () => {
    if (tab === TAB_OVERVIEW) {
      const openTab = (name: 'Memberships' | 'Roles') => {
        const target = tabs.find((t) => t.startsWith(name));
        if (target) leave(() => setTab(target));
      };
      return <ARSOverviewTemplate data={overviewFor(data, openTab)} />;
    }
    if (tab === TAB_DETAILS) {
      return (
        <UserDetailsTab
          key={data.id}
          userId={data.id}
          email={data.email}
          onDirtyChange={setDetailsDirty}
          requestLeave={leave}
        />
      );
    }
    if (tab !== TAB_GENERAL) return <EmptyFigure figure={Dish} label={tab} />;
    return (
      <div className={styles.stack} ref={cardRef}>
        {editing && bannerOpen && hasErrors && (
          <Banner
            tone="error"
            colored
            icon="Warning"
            title="Unable to save and continue"
            onDismiss={() => setBannerOpen(false)}
            actions={
              <>
                <Button size="s" onClick={locateError}>
                  View
                </Button>
                <Button size="s" variant="secondary" onClick={() => setBannerOpen(false)}>
                  Dismiss
                </Button>
              </>
            }
          >
            Locate fields with errors and resolve.
          </Banner>
        )}
        <DetailsCard
          title="Properties"
          helper="Manage identity and display names."
          editing={editing}
          rows={rows}
          fields={fields}
          onEdit={startEditing}
          onCancel={() => leave(cancelEditing)}
          onSave={save}
        />
      </div>
    );
  };

  const onAction = (label: string) => {
    if (label === 'Reset password') setHashParams({ dialog: 'reset-password' });
    if (label === 'Delete') setHashParams({ dialog: 'delete' });
    if (label === 'Move') setHashParams({ dialog: 'move' });
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <ARSUserPage
        title={data.displayName}
        objectClass="User"
        objectName={data.location}
        tab={tab}
        tabs={tabs}
        tabsLabel="User sections"
        onTabChange={(next) => leave(() => setTab(next))}
        actionGroups={USER_OBJECT_ACTIONS('Revoke sessions')}
        onBack={onBack}
        onNextItem={onNext}
        onPreviousItem={onPrevious}
        onMore={pageMenu.openAt}
        onAction={onAction}
      >
        {renderContent()}
      </ARSUserPage>

      <ARSPageMenu
        {...pageMenu.menuProps}
        onAction={(label) => {
          if (label === 'Add to Favorites') onToggleFavorite();
          if (label === 'Ask AI') setAiOpen(true);
        }}
      />

      <ResetPasswordModal
        open={resetOpen}
        onClose={closeDialog}
        user={{ name: data.displayName }}
        location={directoryName}
        entra={data.directory === '@Entra1'}
      />
      <DeleteObjectModal
        open={deleteOpen}
        onClose={closeDialog}
        objectClass="User"
        name={data.displayName}
        location={directoryName}
        onDeleted={onDeleted}
      />
      <UnsavedChangesModal open={guard.open} onCancel={guard.cancel} onConfirm={guard.confirm} />
      <MoveObjectSheet
        open={moveOpen}
        onClose={closeDialog}
        objects={[{ id: data.id, name: data.displayName }]}
        objectType="User"
        currentNodeId={currentNodeId}
        canMoveTo={canMoveTo}
        onMove={(destId) => {
          closeDialog();
          leave(() => onMove(destId));
        }}
      />
    </AppShell>
  );
}
