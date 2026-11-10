import { useMemo, useState, type MouseEvent } from 'react';
import {
  ARSADUserActions,
  ARSActionBar,
  ARSCreateMenu,
  ARSEntraUserActions,
  ARSFilterMenu,
  ARSFlatViewUserContent,
  ARSPageMenu,
} from '@ars';
import { CREATE_MENU } from '@ars/components/ARSCreateMenu/ARSCreateMenu.js';
import { AppShell } from '../AppShell/AppShell.js';
import { useUsers } from '../../lib/usersStore.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import type { BadgeTone } from '../../components/Badge/Badge.js';
import { ResetPasswordModal } from '../ObjectModals/ResetPasswordModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
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

/** Items-per-page choices offered below the list. */
const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];

/** Icon of each Create menu entry, by label. */
const CREATE_ICONS = new Map(
  CREATE_MENU.flatMap((row) => (row === 'divider' || !row.icon ? [] : [[row.label, row.icon] as const])),
);

/**
 * UsersPage — Directory Management, Flat view: the Users list
 * (ARS_Flat View_User_Content) inside the shell's directory layout.
 */
export function UsersPage() {
  const { users, addUser, removeUser } = useUsers();
  const { setAiOpen, setAiContext } = useAppShell();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [showSelected, setShowSelected] = useState(false);

  // Which user (if any) a row-action modal is open for. `null` = closed.
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  // Which object type the Create flow is building. `null` = closed.
  const [createTarget, setCreateTarget] = useState<{ type: string; icon: string } | null>(null);

  const [rowUser, setRowUser] = useState<User | null>(null);
  const rowMenu = useAnchoredMenu();
  const filterMenu = useAnchoredMenu();
  const createMenu = useAnchoredMenu();
  const pageMenu = useAnchoredMenu();

  const rows = useMemo<User[]>(() => {
    const q = query.trim().toLowerCase();
    const matching = q
      ? users.filter((u) =>
          [u.name, u.description, u.email, u.objectId].some((v) => v.toLowerCase().includes(q)),
        )
      : users;
    return showSelected ? matching.filter((u) => selected.has(u.id)) : matching;
  }, [users, query, showSelected, selected]);

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
    if (label === 'Reset Password') setResetUser(rowUser);
    if (label === 'Delete') setDeleteUser(rowUser);
  };

  const onPageAction = (label: string) => {
    if (label === 'Ask AI') setAiOpen(true);
  };

  const selectedUsers = users.filter((u) => selected.has(u.id));
  const onBarAction = (label: string, e: MouseEvent<HTMLButtonElement>) => {
    const only = selectedUsers.length === 1 ? selectedUsers[0] : null;
    if (label === 'Select all') setSelected(new Set(users.map((u) => u.id)));
    if (label === 'Reset password' && only) setResetUser(only);
    if (label === 'Delete' && only) setDeleteUser(only);
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
    const user = userFromValues(result);
    addUser(user);
    announceCreated(result, `#/users/${user.id}`);
  };

  const RowActions = rowUser?.location === 'Entra' ? ARSEntraUserActions : ARSADUserActions;

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Users' }]}>
      <ARSFlatViewUserContent
        className={screen.screen}
        header={{ title: 'Users', icon: 'Users', onMore: pageMenu.openAt }}
        toolbar={{
          variant: 'Basic',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          onFilter: filterMenu.openAt,
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
            tags: u.tags,
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
      <ARSFilterMenu {...filterMenu.menuProps} />
      <ARSPageMenu {...pageMenu.menuProps} onAction={onPageAction} />
      <ARSCreateMenu
        {...createMenu.menuProps}
        onAction={(label) => {
          const type = objectTypeFromMenuLabel(label);
          if (type) setCreateTarget({ type, icon: CREATE_ICONS.get(label) ?? 'User' });
        }}
      />

      <ARSActionBar
        variant={selectedUsers.length === 1 ? '2' : 'Default'}
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
          onClose={() => setResetUser(null)}
          user={{ name: resetUser.details.displayName }}
          location={directoryOf(resetUser).slice(1)}
          entra={resetUser.location === 'Entra'}
        />
      )}
      {deleteUser && (
        <DeleteObjectModal
          open
          onClose={() => setDeleteUser(null)}
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
      {createTarget && (
        <CreateObjectModal
          open
          onClose={() => setCreateTarget(null)}
          objectType={createTarget.type}
          icon={createTarget.icon}
          onCreate={onCreated}
        />
      )}
    </AppShell>
  );
}
