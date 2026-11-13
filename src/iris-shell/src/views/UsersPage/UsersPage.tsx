import { useMemo, useState, type MouseEvent } from 'react';
import {
  ARSADUserActions,
  ARSActionBar,
  ARSEntraUserActions,
  ARSFlatViewUserContent,
  ARSNewUserEntraDir,
  ARSPageMenu,
} from '@ars';
import { NEW_USER_ENTRA_DIR_MENU } from '@ars/components/ARSNewUserEntraDir/ARSNewUserEntraDir.js';
import { AppShell } from '../AppShell/AppShell.js';
import { NoDirectoriesSelected } from '../NoDirectoriesSelected/NoDirectoriesSelected.js';
import { useUsers } from '../../lib/usersStore.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { cx } from '../../lib/cx.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { useMoveUsers } from '../../lib/useMoveUsers.js';
import type { BadgeTone } from '../../components/Badge/Badge.js';
import { ResetPasswordModal } from '../ObjectModals/ResetPasswordModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { ComingSoonModal } from '../ObjectModals/ComingSoonModal.js';
import { inDirectories, isEntraLocation, useDirectoryFilter } from '../../lib/directoryFilter.js';
import { sampleDates, type FilterRow } from '../../lib/listFilters.js';
import { useAdvancedFilter } from '../ListFilters/useAdvancedFilter.js';
import { rowFields } from '../../lib/advancedFilter.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';
import { CreateObjectModal, type CreateObjectResult } from './CreateObjectModal/CreateObjectModal.js';
import {
  announceCreated,
  directoryTypeFor,
  objectTypeFromMenuLabel,
  userFromValues,
} from './CreateObjectModal/createdObject.js';
import { directoryOf, type User } from './mockUsers.js';
import screen from '../ARSScreen/ARSScreen.module.css';

/** Badge tone for a status string; unknown statuses stay neutral. */
function statusTone(status: string): BadgeTone {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
    case 'disabled':
      return 'error';
    case 'unknown':
    case 'pending':
      return 'warning';
    default:
      return 'neutral';
  }
}

/** What the Filters menu sees of a user. The dates are sample values: no list shows them. */
const userRow = (u: User): FilterRow => ({ name: u.name, type: 'User', tags: u.tags, location: u.location, ...sampleDates(u.id) });
const userFields = rowFields(userRow);

/** Items-per-page choices offered below the list. */
const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];

/** Icon of each New user menu entry, by label. */
const CREATE_ICONS = new Map(
  NEW_USER_ENTRA_DIR_MENU.Variant3.flatMap((row) => (row === 'divider' || !row.icon ? [] : [[row.label, row.icon] as const])),
);

/** The icon of the Create menu entry for an object type. */
function createIconFor(type: string): string {
  for (const [label, icon] of CREATE_ICONS) if (objectTypeFromMenuLabel(label) === type) return icon;
  return 'User';
}

/**
 * UsersPage — Directory Management, Flat view: the Users list
 * (ARS_Flat View_User_Content) inside the shell's directory layout.
 */
export function UsersPage() {
  const { users: allUsers, addUser, removeUser } = useUsers();
  const [directories] = useDirectoryFilter();
  // The directory filter in the panel: an Entra user sits in one of the Entra directories, an AD user in an AD one.
  const users = useMemo(
    () => allUsers.filter((u) => inDirectories(directories, u.location)),
    [allUsers, directories],
  );
  const [removedTags, setRemovedTags] = useState<Map<string, Set<string>>>(() => new Map());
  const { setAiOpen, setAiContext } = useAppShell();
  const moveUsers = useMoveUsers();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selected, setSelectedSet] = useHashSelection();
  const setSelected = (next: Set<string> | ((s: Set<string>) => Set<string>)) =>
    setSelectedSet(typeof next === 'function' ? next(selected) : next);
  const [showSelected, setShowSelected] = useState(false);

  // The open dialog and what it is about live in the address
  // (?select=a,b&dialog=delete&target=a, or ?dialog=create&type=User).
  const [dialog] = useHashParam('dialog');
  const [targetParam] = useHashParam('target');
  const [typeParam] = useHashParam('type');
  const targets = useMemo(() => {
    const ids = targetParam ? targetParam.split(',') : [];
    return allUsers.filter((u) => ids.includes(u.id));
  }, [allUsers, targetParam]);
  const resetUser = dialog === 'reset-password' ? (targets[0] ?? null) : null;
  const deleteUser = dialog === 'delete' ? (targets[0] ?? null) : null;
  const comingSoonUser = dialog === 'deprovision' || dialog === 'deactivate' ? (targets[0] ?? null) : null;
  const moveTargets = dialog === 'move' ? targets : null;
  const createTarget = dialog === 'create' && typeParam ? { type: typeParam, icon: createIconFor(typeParam) } : null;
  const closeDialog = () => setHashParams({ dialog: null, target: null, type: null });
  const openDialog = (name: string, ids: string[] = []) =>
    setHashParams({ dialog: name, target: ids.length ? ids.join(',') : null, type: null });

  const [rowUser, setRowUser] = useState<User | null>(null);
  const rowMenu = useAnchoredMenu();
  const lf = useAdvancedFilter(users, userFields);
  const createMenu = useAnchoredMenu();
  const pageMenu = useAnchoredMenu();

  const rows = useMemo<User[]>(() => {
    const q = query.trim().toLowerCase();
    const matching = q
      ? lf.filtered.filter((u) =>
          [u.name, u.description, u.email, u.objectId].some((v) => v.toLowerCase().includes(q)),
        )
      : lf.filtered;
    return showSelected ? matching.filter((u) => selected.has(u.id)) : matching;
  }, [lf.filtered, query, showSelected, selected]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize],
  );

  // Changing the page size keeps the first visible row in view.
  const handlePageSizeChange = (nextSize: number) => {
    const firstVisibleIndex = (safePage - 1) * pageSize;
    setPageSize(nextSize);
    setPage(Math.floor(firstVisibleIndex / nextSize) + 1);
  };

  const onRowAction = (label: string) => {
    if (!rowUser) return;
    if (label === 'Reset Password') openDialog('reset-password', [rowUser.id]);
    if (label === 'Delete') openDialog('delete', [rowUser.id]);
    if (label === 'Move') openDialog('move', [rowUser.id]);
    if (label === 'Deprovision') openDialog('deprovision', [rowUser.id]);
    if (label === 'Deactivate') openDialog('deactivate', [rowUser.id]);
  };

  const onPageAction = (label: string) => {
    if (label === 'Ask AI') setAiOpen(true);
  };

  const selectedUsers = users.filter((u) => selected.has(u.id));
  const onBarAction = (label: string, e: MouseEvent<HTMLButtonElement>) => {
    const only = selectedUsers.length === 1 ? selectedUsers[0] : null;
    if (label === 'Select all') setSelected(new Set(users.map((u) => u.id)));
    if (label === 'Reset password' && only) openDialog('reset-password', [only.id]);
    if (label === 'Delete' && only) openDialog('delete', [only.id]);
    if (label === 'Move') openDialog('move', selectedUsers.map((u) => u.id));
    if (label === 'More actions' && only) {
      setRowUser(only);
      rowMenu.openAt(e);
    }
    if (label === 'Ask AI') {
      setAiContext(selectedUsers.map((u) => ({ kind: 'user' as const, id: u.id, label: u.name })));
      setAiOpen(true);
    }
  };

  const onCreated = (result: CreateObjectResult) => {
    if (directoryTypeFor(result.objectType) !== 'user') {
      announceCreated(result);
      return;
    }
    const created = userFromValues(result);
    // A new Entra user is an Entra user in the list: its row menu and directory follow.
    const user =
      result.objectType === 'Entra User'
        ? { ...created, location: 'Entra', details: { ...created.details, directory: '@Entra1' } }
        : created;
    addUser(user);
    announceCreated(result, `#/users/${user.id}`);
  };

  const RowActions = isEntraLocation(rowUser?.location ?? '') ? ARSEntraUserActions : ARSADUserActions;

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Users' }]}>
      <ARSFlatViewUserContent
        className={cx(screen.screen, selected.size > 0 && screen.withBar)}
        header={{ title: 'Users', icon: 'Users', onMore: pageMenu.openAt }}
        empty={directories.size === 0 ? <NoDirectoriesSelected /> : lf.emptyWhen(rows.length)}
        toolbar={{
          variant: 'Basic',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          onFilter: lf.onFilter,
          filterCount: lf.filterCount,
          filterPressed: lf.filterPressed,
          actionLabel: 'Create',
          onAction: createMenu.openAt,
        }}
        table={{
          rows: pageRows.map((u) => ({
            id: u.id,
            name: u.name,
            href: `#/users/${u.id}`,
            status: u.status,
            statusTone: statusTone(u.status),
            description: u.description,
            tags: u.tags.filter((t) => !removedTags.get(u.id)?.has(t)),
            onRemoveTag: (tag) =>
              setRemovedTags((prev) => new Map(prev).set(u.id, new Set([...(prev.get(u.id) ?? []), tag]))),
            location: u.location,
            onMore: (e) => {
              setRowUser(u);
              rowMenu.openAt(e);
            },
          })),
          selected,
          onSelectionChange: setSelected,
          page: safePage,
          pageCount,
          onPageChange: setPage,
          pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      <RowActions {...rowMenu.menuProps} ariaLabel={`Actions for ${rowUser?.name ?? 'user'}`} onAction={onRowAction} />
      <ARSPageMenu {...pageMenu.menuProps} onAction={onPageAction} />
      <ARSNewUserEntraDir
        variant="Variant3"
        {...createMenu.menuProps}
        onAction={(label) => {
          // "Add User" has no design yet.
          if (label === 'Add User') {
            setHashParams({ dialog: 'add-user', type: null, target: null });
            return;
          }
          const type = objectTypeFromMenuLabel(label);
          if (type) setHashParams({ dialog: 'create', type, target: null });
        }}
      />

      <ARSActionBar
        variant={selectedUsers.length === 1 ? '2' : 'Default'}
        showDelete={selectedUsers.length !== 1}
        hiddenActions={selectedUsers.some((u) => isEntraLocation(u.location)) ? ['Move'] : undefined}
        open={selected.size > 0}
        selectedCount={selected.size}
        totalCount={users.length}
        showTotal
        showSelected={showSelected}
        onShowSelectedChange={setShowSelected}
        layout="inline"
        onAction={onBarAction}
        onDismiss={() => {
          setSelected(new Set());
          setShowSelected(false);
        }}
      />

      {resetUser && (
        <ResetPasswordModal
          open
          onClose={closeDialog}
          user={{ name: resetUser.details.displayName }}
          location={directoryOf(resetUser).slice(1)}
          entra={isEntraLocation(resetUser.location)}
        />
      )}
      {deleteUser && (
        <DeleteObjectModal
          open
          onClose={closeDialog}
          objectClass="User"
          name={deleteUser.details.displayName}
          location={directoryOf(deleteUser).slice(1)}
          onDeleted={() => {
            removeUser(deleteUser.id);
            setSelected((s) => {
              const next = new Set(s);
              next.delete(deleteUser.id);
              return next;
            });
          }}
        />
      )}
      {dialog === 'add-user' && <ComingSoonModal open onClose={closeDialog} title="Add user" />}
      {comingSoonUser && (
        <ComingSoonModal
          open
          onClose={closeDialog}
          title={dialog === 'deprovision' ? 'Deprovision user' : 'Deactivate user'}
          subtitle={comingSoonUser.details.displayName}
        />
      )}
      <MoveObjectSheet
        open={moveTargets !== null}
        onClose={closeDialog}
        objects={(moveTargets ?? []).map((u) => ({ id: u.id, name: u.name }))}
        objectType="User"
        canMoveTo={(destId) => moveUsers.canMoveTo(moveTargets ?? [], destId)}
        onMove={(destId, objs) => {
          moveUsers.move(
            (moveTargets ?? []).filter((u) => objs.some((o) => o.id === u.id)),
            destId,
          );
          closeDialog();
        }}
      />
      {createTarget && (
        <CreateObjectModal
          open
          onClose={closeDialog}
          objectType={createTarget.type}
          icon={createTarget.icon}
          onCreate={onCreated}
        />
      )}
    </AppShell>
  );
}
