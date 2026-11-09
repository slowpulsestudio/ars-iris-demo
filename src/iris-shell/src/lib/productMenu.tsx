import { useMemo } from 'react';
import type { MenuEntry } from '../components/Menu/Menu.js';
import { ProductIcon, type ProductIconName } from '../components/ProductIcon/ProductIcon.js';
import { navigate } from './router.js';
import { useAppShell } from './appShellContext.js';
import { useVertical, type VerticalId } from './verticals.js';

interface ProductEntry {
  id: VerticalId | 'identity-manager' | 'safeguard';
  label: string;
  icon: ProductIconName;
  /** If set, clicking the item navigates to this hash. Items without a target
   *  remain inactive placeholders. */
  route?: string;
}

const PRODUCTS: ProductEntry[] = [
  { id: 'active-roles', label: 'Active Roles', icon: 'active-roles', route: '#/insights' },
  { id: 'identity-manager', label: 'Identity Manager', icon: 'identity-manager', route: '#/identity' },
  { id: 'safeguard', label: 'Safeguard', icon: 'safeguard', route: '#/safeguard' },
  { id: 'services', label: 'On Demand Services', icon: 'services', route: '#/services' },
];

/**
 * Product chooser entries for the current vertical. Items with a `route` are
 * clickable and switch verticals via {@link navigate}; the rest stay inactive
 * (non-interactive placeholders). The entry matching the active vertical is
 * marked `selected`. Active Roles opens on the picked persona's start page.
 */
export function useProductMenuItems(): MenuEntry[] {
  const vertical = useVertical();
  const personaStart = useAppShell().persona?.navigation.defaultRoute;
  return useMemo(
    () =>
      PRODUCTS.map((p): MenuEntry => {
        const isActive = p.id === vertical.id;
        const route = p.id === 'active-roles' ? (personaStart ?? p.route) : p.route;
        const hasRoute = typeof route === 'string';
        return {
          kind: 'item',
          label: p.label,
          visual: <ProductIcon name={p.icon} />,
          selected: isActive,
          inactive: !hasRoute,
          onSelect: hasRoute && !isActive ? () => navigate(route!) : undefined,
        };
      }),
    [vertical.id, personaStart],
  );
}
