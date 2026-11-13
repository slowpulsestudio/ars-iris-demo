import { useCallback } from 'react';
import type { User } from '../views/UsersPage/mockUsers.js';
import { isMoveDestination } from './directoryData.js';
import { useDirectory } from './directoryStore.js';
import { announceMoved, userLocationFor } from './moveObjects.js';
import { useUsers } from './usersStore.js';

/** Moving Flat view users: their Location becomes the destination folder's path. */
export function useMoveUsers() {
  const { updateUser } = useUsers();
  const { getPath } = useDirectory();

  /** Whether at least one of `targets` isn't already in the folder `destId`. */
  const canMoveTo = useCallback(
    (targets: User[], destId: string) => {
      if (!isMoveDestination(destId)) return false;
      const location = userLocationFor(getPath(destId));
      return targets.some((u) => u.location !== location);
    },
    [getPath],
  );

  /** Moves the users that aren't there yet and shows the toast. Returns who moved. */
  const move = useCallback(
    (targets: User[], destId: string): User[] => {
      const path = getPath(destId);
      const location = userLocationFor(path);
      const moving = targets.filter((u) => u.location !== location);
      if (moving.length === 0) return [];
      const before = moving.map((u) => ({ id: u.id, location: u.location }));
      moving.forEach((u) => updateUser(u.id, { location }));
      announceMoved({
        names: moving.map((u) => u.name),
        typeLabel: 'User',
        destName: path[path.length - 1]?.name ?? location,
        undo: () => before.forEach((b) => updateUser(b.id, { location: b.location })),
        viewHref: moving.length === 1 ? `#/users/${moving[0].id}` : `#/tree/${destId}`,
      });
      return moving;
    },
    [getPath, updateUser],
  );

  return { canMoveTo, move };
}
