import { useEffect, useState } from 'react';
import { findPersona } from './personas.js';

/**
 * Tiny hash-based router for the PoC. No deps.
 *
 *   parseHash('#/users/abc')        -> { name: 'userDetail', params: { id: 'abc' } }
 *   parseHash('#/users')            -> { name: 'usersList',  params: {} }
 *   anything else                    -> { name: 'usersList', params: {} }
 *
 * An address can start with a persona id, e.g. `#/admin-user/users/abc`. The
 * persona is signed in and the rest is the page (see `splitPersonaHash`), so
 * a link can open a screen as a given persona.
 *
 * To navigate: `navigate('#/users/abc')`. Components subscribe via `useRoute()`.
 */

export type Route =
  | { name: 'userDetail'; params: { id: string } }
  | { name: 'usersList'; params: Record<string, never> }
  | { name: 'treeRoot'; params: Record<string, never> }
  | { name: 'treeList'; params: { nodeId: string } }
  | { name: 'treeDetail'; params: { nodeId: string; objectId: string } }
  | { name: 'favoritesList'; params: Record<string, never> }
  | { name: 'favoritesFolder'; params: { nodeId: string } }
  | { name: 'groups'; params: Record<string, never> }
  | { name: 'devices'; params: Record<string, never> }
  | { name: 'agents'; params: Record<string, never> }
  | { name: 'applications'; params: Record<string, never> }
  | { name: 'accessTemplates'; params: Record<string, never> }
  | { name: 'managementUnits'; params: Record<string, never> }
  | { name: 'managedUnitMembers'; params: { id: string } }
  | { name: 'insights'; params: Record<string, never> }
  | { name: 'services'; params: Record<string, never> }
  | { name: 'identityHome'; params: Record<string, never> }
  | { name: 'identityInsights'; params: Record<string, never> }
  | { name: 'identitySettings'; params: Record<string, never> }
  | { name: 'identityHelp'; params: Record<string, never> }
  | { name: 'identitySection'; params: { group: string; item: string } }
  | { name: 'safeguardHome'; params: Record<string, never> }
  | { name: 'welcome'; params: Record<string, never> }
  | { name: 'storybooks'; params: Record<string, never> }
  | { name: 'componentsReview'; params: Record<string, never> }
  | { name: 'componentsReviewMissing'; params: Record<string, never> }
  | { name: 'componentsReviewTasks'; params: Record<string, never> }
  | { name: 'componentsReviewTidyUp'; params: Record<string, never> }
  | { name: 'componentsReviewRecommendations'; params: Record<string, never> }
  | { name: 'userViewHome'; params: Record<string, never> }
  | { name: 'userViewProfile'; params: Record<string, never> }
  | { name: 'userViewApprovals'; params: Record<string, never> }
  | { name: 'userViewAccess'; params: Record<string, never> };

export type RouteName = Route['name'];

interface RouteDef {
  name: RouteName;
  pattern: RegExp;
  keys: string[];
}

const ROUTES: RouteDef[] = [
  { name: 'userDetail', pattern: /^#\/users\/([^/]+)$/, keys: ['id'] },
  { name: 'usersList', pattern: /^#\/users$/, keys: [] },
  { name: 'treeDetail', pattern: /^#\/tree\/([^/]+)\/([^/]+)$/, keys: ['nodeId', 'objectId'] },
  { name: 'treeList', pattern: /^#\/tree\/([^/]+)$/, keys: ['nodeId'] },
  { name: 'treeRoot', pattern: /^#\/tree$/, keys: [] },
  { name: 'favoritesList', pattern: /^#\/favorites$/, keys: [] },
  { name: 'favoritesFolder', pattern: /^#\/favorites\/([^/]+)$/, keys: ['nodeId'] },
  { name: 'groups', pattern: /^#\/groups$/, keys: [] },
  { name: 'devices', pattern: /^#\/devices$/, keys: [] },
  { name: 'agents', pattern: /^#\/agents$/, keys: [] },
  { name: 'applications', pattern: /^#\/applications$/, keys: [] },
  { name: 'accessTemplates', pattern: /^#\/access-templates$/, keys: [] },
  { name: 'managementUnits', pattern: /^#\/management-units$/, keys: [] },
  { name: 'managedUnitMembers', pattern: /^#\/management-units\/([^/]+)$/, keys: ['id'] },
  { name: 'insights', pattern: /^#\/insights$/, keys: [] },
  { name: 'services', pattern: /^#\/services$/, keys: [] },
  { name: 'identityInsights', pattern: /^#\/identity\/insights$/, keys: [] },
  { name: 'identitySettings', pattern: /^#\/identity\/settings$/, keys: [] },
  { name: 'identityHelp', pattern: /^#\/identity\/help$/, keys: [] },
  { name: 'identitySection', pattern: /^#\/identity\/([^/]+)\/([^/]+)$/, keys: ['group', 'item'] },
  { name: 'identityHome', pattern: /^#\/identity$/, keys: [] },
  { name: 'safeguardHome', pattern: /^#\/safeguard$/, keys: [] },
  { name: 'welcome', pattern: /^#\/welcome$/, keys: [] },
  { name: 'storybooks', pattern: /^#\/storybooks$/, keys: [] },
  { name: 'componentsReview', pattern: /^#\/components-to-review$/, keys: [] },
  { name: 'componentsReviewMissing', pattern: /^#\/components-to-review\/missing$/, keys: [] },
  { name: 'componentsReviewTasks', pattern: /^#\/components-to-review\/tasks$/, keys: [] },
  { name: 'componentsReviewTidyUp', pattern: /^#\/components-to-review\/tidy-up$/, keys: [] },
  { name: 'componentsReviewRecommendations', pattern: /^#\/components-to-review\/recommendations$/, keys: [] },
  { name: 'userViewHome', pattern: /^#\/user-view\/home$/, keys: [] },
  { name: 'userViewProfile', pattern: /^#\/user-view\/profile$/, keys: [] },
  { name: 'userViewApprovals', pattern: /^#\/user-view\/approvals$/, keys: [] },
  { name: 'userViewAccess', pattern: /^#\/user-view\/my-access$/, keys: [] },
];

/** Start page: the welcome page with the persona picker. */
const DEFAULT = '#/welcome';

/** Splits `#/path?a=b` into `#/path` and `?a=b` (empty when there is no query). */
function splitQuery(hash: string): [string, string] {
  const i = hash.indexOf('?');
  return i < 0 ? [hash, ''] : [hash.slice(0, i), hash.slice(i)];
}

/**
 * Splits `#/<persona-id>/<page>` into the persona and the page address. `#/<persona-id>` alone
 * opens that persona's start page. Addresses without a persona id come back unchanged. A
 * `?query` on the address is kept on the returned path.
 */
export function splitPersonaHash(hash: string | null | undefined): { personaId: string | null; path: string } {
  const h = hash || DEFAULT;
  const [base, query] = splitQuery(h);
  const m = base.match(/^#\/([^/]+)(\/.*)?$/);
  const persona = m ? findPersona(m[1]) : undefined;
  if (!m || !persona) return { personaId: null, path: h };
  return { personaId: persona.id, path: (m[2] ? `#${m[2]}` : persona.navigation.defaultRoute) + query };
}

/** The address of a page as seen by one persona, e.g. `#/admin-user/users`. */
export function personaHash(personaId: string, path: string): string {
  return `#/${personaId}${path.replace(/^#/, '')}`;
}

function parseHash(hash: string | null | undefined): Route {
  const [h] = splitQuery(splitPersonaHash(hash).path);
  for (const r of ROUTES) {
    const m = h.match(r.pattern);
    if (m) {
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => {
        params[k] = decodeURIComponent(m[i + 1]);
      });
      return { name: r.name, params } as Route;
    }
  }
  return { name: 'usersList', params: {} };
}

/**
 * Programmatic navigation. Updates the URL hash (and triggers `hashchange`
 * which `useRoute` listens to).
 */
export function navigate(path: string): void {
  if (typeof window === 'undefined') return;
  if (window.location.hash === path) return;
  if (guard && !guard(path)) return;
  window.location.hash = path;
  // Always scroll to top on route change for a real-page-navigation feel.
  window.scrollTo(0, 0);
}

let guard: ((path: string) => boolean) | null = null;
let lastHash = typeof window === 'undefined' ? '' : window.location.hash;

const HASH_STATE_EVENT = 'ars-hash-state';

/**
 * Changes the address without adding a history entry or running the navigation guard. For
 * page state kept in the address (a tab, an open dialog), not for moving to another page.
 */
export function replaceHash(next: string): void {
  if (typeof window === 'undefined' || window.location.hash === next) return;
  window.history.replaceState(null, '', next);
  lastHash = next;
  window.dispatchEvent(new Event(HASH_STATE_EVENT));
}

/** Calls `callback` whenever the address changes, by navigation or by `replaceHash`. */
export function subscribeHash(callback: () => void): () => void {
  window.addEventListener('hashchange', callback);
  window.addEventListener(HASH_STATE_EVENT, callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener(HASH_STATE_EVENT, callback);
  };
}

/**
 * Lets a page hold back navigation (e.g. a form with unsaved changes): the
 * guard returns false to block, and the page can call `navigate()` again once
 * it has cleared its guard. It covers `navigate()`, links and the browser's
 * Back and Forward buttons; a blocked hash change puts the old address back.
 */
export function setNavigationGuard(next: ((path: string) => boolean) | null): void {
  guard = next;
}

// Registered when the module loads, so it runs before any `useRoute` listener.
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', (e) => {
    const next = window.location.hash;
    if (guard && next !== lastHash && !guard(next)) {
      e.stopImmediatePropagation();
      window.history.replaceState(null, '', lastHash || DEFAULT);
      return;
    }
    lastHash = next;
  });
}

/**
 * useRoute — returns the currently active route.
 */
function normalizeAddressBar(): void {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) {
    window.history.replaceState(null, '', DEFAULT);
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined'
      ? { name: 'usersList', params: {} }
      : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      // Re-normalize whenever the hash is cleared (e.g. user edits the URL).
      normalizeAddressBar();
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    normalizeAddressBar();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
