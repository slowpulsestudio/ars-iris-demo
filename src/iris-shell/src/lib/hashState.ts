import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { replaceHash, subscribeHash } from './router.js';

/**
 * Page state kept in the address: `#/admin-user/users/abc?tab=general&edit=general`. The address is the
 * single source of truth, so a link, a refresh and the Back button all land in the same state.
 *
 * Keys in use (see docs/deep-linking.md):
 *   tab      the active tab, as a slug (`general`, `user-details`)
 *   edit     the card being edited (`general`, `ownership`)
 *   dialog   the open dialog or side sheet (`delete`, `move`, `create`)
 *   target   the row a dialog is about (an object or request id)
 *   select   the ticked rows, comma-separated ids
 *   view     a sub-view of a tab (`members-of`)
 *   request, modal, sheet   the self-service screens
 */

/** `User Details` -> `user-details`. */
export function slug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readParams(hash: string): URLSearchParams {
  const i = hash.indexOf('?');
  return new URLSearchParams(i < 0 ? '' : hash.slice(i + 1));
}

/** Sets or removes (`null`) query values on the current address, keeping the rest. */
export function setHashParams(updates: Record<string, string | null | undefined>): void {
  const hash = window.location.hash || '#/welcome';
  const i = hash.indexOf('?');
  const base = i < 0 ? hash : hash.slice(0, i);
  const params = readParams(hash);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '') params.delete(key);
    else params.set(key, value);
  }
  const query = params.toString().replace(/%2C/g, ',');
  replaceHash(query ? `${base}?${query}` : base);
}

/** One query value of the address, and a setter that writes it back (`null` removes it). */
export function useHashParam(key: string): [string | null, (value: string | null) => void] {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash);
  const value = readParams(hash).get(key);
  const set = useCallback((next: string | null) => setHashParams({ [key]: next }), [key]);
  return [value, set];
}

/** A tab label as an address slug, without its count: `Memberships (8)` -> `memberships`. */
function tabSlug(label: string): string {
  return slug(label.replace(/\s*\(\d+\)\s*$/, ''));
}

/**
 * The active tab, from `?tab=`. An unknown or missing value is the first tab, which is also
 * written as no value, so the plain address of a page stays clean. Changing tab also closes
 * anything open on the old one (`edit`, `dialog`, `target`, `view`).
 */
export function useHashTab(tabs: string[]): [string, (label: string) => void] {
  const [value] = useHashParam('tab');
  const label = tabs.find((t) => tabSlug(t) === value) ?? tabs[0];
  const set = useCallback(
    (next: string) =>
      setHashParams({
        tab: next === tabs[0] ? null : tabSlug(next),
        edit: null,
        dialog: null,
        target: null,
        view: null,
      }),
    [tabs],
  );
  return [label, set];
}

/** The ticked rows (`select=a,b`) and a setter. */
export function useHashSelection(): [Set<string>, (next: Set<string>) => void] {
  const [value, set] = useHashParam('select');
  const selected = useMemo(() => new Set(value ? value.split(',').filter(Boolean) : []), [value]);
  return [selected, (next) => set(next.size ? [...next].join(',') : null)];
}
