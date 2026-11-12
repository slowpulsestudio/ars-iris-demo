import { AppShell } from '../AppShell/AppShell.js';
import { ComingSoon } from '../ComingSoon/ComingSoon.js';

/**
 * SafeguardPage — landing surface for the Safeguard vertical.
 * Hosted at `#/safeguard`. Sidebar items other than Instance are disabled
 * placeholders for now; the content is the "Coming soon" placeholder.
 */
export function SafeguardPage() {
  return (
    <AppShell
      breadcrumb={[{ label: 'Instance' }]}
      activeGlobalItem="instance"
      showSecondarySidebar={false}
    >
      <ComingSoon label="Safeguard" />
    </AppShell>
  );
}
