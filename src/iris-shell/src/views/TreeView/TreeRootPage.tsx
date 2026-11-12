import { Riffle } from '@lucasmarkes/hairline/react';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';
import { AppShell } from '../AppShell/AppShell.js';

/** TreeRootPage — Tree view with no directory or folder selected (`#/tree`). */
export function TreeRootPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Managed directories' }]}>
      <EmptyFigure
        figure={Riffle}
        title="No directory or folder selected."
        description="Choose a directory or folder to display its contents here."
      />
    </AppShell>
  );
}
