import { useCallback, useEffect, useRef } from 'react';
import type { User } from '../views/UsersPage/mockUsers.js';
import { isMoveDestination } from './directoryData.js';
import { useDirectory } from './directoryStore.js';
import { startJob } from './jobsStore.js';
import { announceMoved, folderForUserLocation, userLocationFor } from './moveObjects.js';
import { useUsers } from './usersStore.js';

/** Moving Flat view users: their Location becomes the destination folder's path. */
export function useMoveUsers() {
  const { updateUser } = useUsers();
  // A Background Job outlives the render that started it, so it moves users through the latest updateUser.
  const updateUserRef = useRef(updateUser);
  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);
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

  /**
   * Moves the users that aren't there yet. One user is instant and shows the toast; several start a Background Job
   * that moves them one at a time. Returns who is moving.
   */
  const move = useCallback(
    (targets: User[], destId: string): User[] => {
      const path = getPath(destId);
      const location = userLocationFor(path);
      const moving = targets.filter((u) => folderOf(u) !== destId);
      if (moving.length === 0) return [];
      const destName = path[path.length - 1]?.name ?? location;
      if (moving.length >= 2) {
        const origins = new Set(moving.map((u) => u.location));
        startJob({
          title: 'Moving users',
          total: moving.length,
          from: origins.size === 1 ? [...origins][0] : 'Several locations',
          to: location,
          step: (i) => updateUserRef.current(moving[i].id, { location }),
          viewHref: `#/tree/${destId}`,
        });
        return moving;
      }
      const before = moving.map((u) => ({ id: u.id, location: u.location }));
      moving.forEach((u) => updateUser(u.id, { location }));
      announceMoved({
        names: moving.map((u) => u.name),
        typeLabel: 'User',
        destName,
        undo: () => before.forEach((b) => updateUser(b.id, { location: b.location })),
        viewHref: moving.length === 1 ? `#/users/${moving[0].id}` : `#/tree/${destId}`,
      });
      return moving;
    },
    [getPath, updateUser, folderOf],
  );

  return { currentFolder, canMoveTo, move };
}
