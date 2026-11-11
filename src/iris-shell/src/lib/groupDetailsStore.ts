import { useMemo, useSyncExternalStore } from 'react';
import type { DirectoryObject } from './directoryData.js';

/**
 * groupDetailsStore — the group fields the directory data doesn't have
 * (scope, type, email, ownership and so on), kept for the session. Until
 * edited, each is derived from the object.
 */

export const GROUP_SCOPES = ['Domain local', 'Global', 'Universal'];
export const GROUP_TYPES = ['Security', 'Distribution'];

export interface GroupProps {
  groupName: string;
  resourceUrl: string;
  keywords: string;
  email: string;
  scope: string;
  type: string;
  tags: string;
  office: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  fax: string;
  secondaryCanUpdate: boolean;
}

const EMPTY: Partial<GroupProps> = Object.freeze({});
const saved = new Map<string, Partial<GroupProps>>();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function defaultsFor(object: DirectoryObject): GroupProps {
  const h = hash(object.id);
  return {
    groupName: object.name,
    resourceUrl: '',
    keywords: '',
    email: `${object.name.toLowerCase().replace(/\s+/g, '.')}@contoso.com`,
    scope: GROUP_SCOPES[h % GROUP_SCOPES.length],
    type: h % 3 === 0 ? 'Distribution' : 'Security',
    tags: '',
    office: '',
    street: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    fax: '',
    secondaryCanUpdate: false,
  };
}

/** The group's fields: what was saved, over what the object gives. */
export function useGroupProps(object: DirectoryObject): GroupProps {
  const edited = useSyncExternalStore(
    subscribe,
    () => saved.get(object.id) ?? EMPTY,
    () => EMPTY,
  );
  return useMemo(() => ({ ...defaultsFor(object), ...edited }), [object, edited]);
}

export function saveGroupProps(id: string, patch: Partial<GroupProps>): void {
  saved.set(id, { ...(saved.get(id) ?? {}), ...patch });
  listeners.forEach((l) => l());
}
