import { useCallback } from 'react';
import type { User } from '../views/UsersPage/mockUsers.js';
import { isMoveDestination } from './directoryData.js';
import { useDirectory } from './directoryStore.js';
import { announceMoved, folderForUserLocation, userLocationFor } from './moveObjects.js';
import { useUsers } from './usersStore.js';

/** Moving Flat view users: their Location becomes the destination folder's path. */
export function useMoveUsers() {
  const { updateUser } = useUsers();
  const { getPath, nodeTree } = useDirectory();

  /** The folder a user's Location points to, or null outside the tree. */
  const folderOf = useCallback((user: User) => folderForUserLocation(user.location, nodeTree), [nodeTree]);

  /** The folder all of `targets` are in, which the Move sheet opens at and ticks; null when they are in several. */
  const currentFolder = useCallback(
    (targets: User[]): string | null => {
      const folders = new Set(targets.map(folderOf));
      return folders.size === 1 ? [...folders][0] : null;
    },
    [folderOf],
  );

  /** Whether at least one of `targets` isn't already in the folder `destId`. */
  const canMoveTo = useCallback(
    (targets: User[], destId: string) => isMoveDestination(destId) && targets.some((u) => folderOf(u) !== destId),
    [folderOf],
  );

  /** Moves the users that aren't there yet and shows the toast. Returns who moved. */
  const move = useCallback(
    (targets: User[], destId: string): User[] => {
      const path = getPath(destId);
      const location = userLocationFor(path);
      const moving = targets.filter((u) => folderOf(u) !== destId);
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
    [getPath, updateUser, folderOf],
  );

  return { currentFolder, canMoveTo, move };
}
