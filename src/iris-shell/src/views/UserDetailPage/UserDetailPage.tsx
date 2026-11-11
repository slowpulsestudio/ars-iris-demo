import { useEffect } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { useUsers } from '../../lib/usersStore.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { useMoveUsers } from '../../lib/useMoveUsers.js';
import { isTypingTarget } from '../../lib/keyboard.js';
import { Button } from '../../components/Button/Button.js';
import { UserObjectPage, type UserObjectData } from '../ObjectPage/UserObjectPage.js';
import { directoryOf, type User } from '../UsersPage/mockUsers.js';
import styles from './UserDetailPage.module.css';

export interface UserDetailPageProps {
  userId: string;
}

function toObjectData(user: User): UserObjectData {
  const d = user.details;
  return {
    id: user.id,
    name: user.name,
    firstName: d.firstName,
    lastName: d.lastName,
    displayName: d.displayName,
    initials: d.initials,
    description: d.longDescription,
    login: d.login,
    directory: directoryOf(user),
    email: user.email,
    status: user.status,
    objectId: user.objectId,
    location: user.location,
  };
}

/**
 * UserDetailPage — a user from the Flat view list, shown on the ARS user page.
 *
 * Falls back to a "not found" panel if the id can't be resolved.
 */
export function UserDetailPage({ userId }: UserDetailPageProps) {
  const { users, getUser, getUserIndex, updateUser, removeUser } = useUsers();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const moveUsers = useMoveUsers();
  const user = getUser(userId);

  const idx = getUserIndex(userId);
  const prevUser = users[idx - 1] ?? null;
  const nextUser = users[idx + 1] ?? null;

  /* ---- J / K jump to the next / previous user (Gmail/GitHub style) ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // Don't hijack the keys while the user is typing in a field.
      if (isTypingTarget(e.target)) return;
      // Don't navigate away while a modal dialog or a menu is open.
      if (document.querySelector('[aria-modal="true"], [role="menu"]')) return;
      const key = e.key.toLowerCase();
      if (key !== 'j' && key !== 'k') return;
      const i = getUserIndex(userId);
      if (i < 0) return;
      const target = key === 'j' ? users[i + 1] : users[i - 1];
      if (target) {
        e.preventDefault();
        navigate(`#/users/${target.id}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [users, userId, getUserIndex]);

  if (!user) {
    return (
      <AppShell
        breadcrumb={[
          { label: 'Directory Management' },
          { label: 'Users', onClick: () => navigate('#/users') },
          { label: 'Not found' },
        ]}
      >
        <div className={styles.missing}>
          <h1 className={styles.missingTitle}>User not found</h1>
          <p className={styles.missingBody}>
            We couldn’t find a user with id <code>{userId}</code>.
          </p>
          <Button variant="secondary" onClick={() => navigate('#/users')}>
            Back to Users
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <UserObjectPage
      breadcrumb={[
        { label: 'Directory Management' },
        { label: 'Users', onClick: () => navigate('#/users') },
        { label: user.name },
      ]}
      data={toObjectData(user)}
      isLogonTaken={(login, directory) =>
        users.some(
          (u) =>
            u.id !== user.id &&
            `${u.details.login}${directoryOf(u)}`.toLowerCase() === `${login}${directory}`.toLowerCase(),
        )
      }
      onSave={(patch) =>
        updateUser(user.id, {
          details: {
            firstName: patch.firstName,
            lastName: patch.lastName,
            displayName: patch.displayName,
            initials: patch.initials,
            longDescription: patch.description,
            login: patch.login,
            directory: patch.directory,
          },
        })
      }
      onBack={() => navigate('#/users')}
      onDeleted={() => {
        navigate('#/users');
        removeUser(user.id);
      }}
      onPrevious={prevUser ? () => navigate(`#/users/${prevUser.id}`) : undefined}
      onNext={nextUser ? () => navigate(`#/users/${nextUser.id}`) : undefined}
      isFavorite={isFavorite(user.id)}
      canMoveTo={(destId) => moveUsers.canMoveTo([user], destId)}
      onMove={(destId) => moveUsers.move([user], destId)}
      onToggleFavorite={() =>
        toggleFavorite({
          id: user.id,
          name: user.name,
          type: 'User',
          description: user.description,
          href: `#/users/${user.id}`,
        })
      }
    />
  );
}
