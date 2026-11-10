import { ARSEmpty } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';

/** TreeRootPage — Tree view with no directory or folder selected (`#/tree`). */
export function TreeRootPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Managed directories' }]}>
      <ARSEmpty />
    </AppShell>
  );
}
