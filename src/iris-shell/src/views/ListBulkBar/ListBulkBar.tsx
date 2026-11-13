import { ARSActionBar } from '@ars';
import { useAppShell } from '../../lib/appShellContext.js';
import { navigate } from '../../lib/router.js';

export interface ListBulkBarProps {
  /** Every row the list shows, across its pages. */
  rows: { id: string; href?: string }[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

/**
 * ListBulkBar — the ARS bulk action bar (ARS_Action_bar 2385:59821) for a list whose rows can be ticked, the
 * same bar as the Managed Units pages. Select all, Properties (one row: opens it) and Ask AI work; Copy, Move and
 * Delete have no flow on these lists yet.
 */
export function ListBulkBar({ rows, selectedIds, onSelectedIdsChange }: ListBulkBarProps) {
  const { setAiOpen } = useAppShell();
  return (
    <ARSActionBar
      open={selectedIds.length > 0}
      selectedCount={selectedIds.length}
      totalCount={rows.length}
      showTotal
      layout="inline"
      onAction={(label) => {
        const only = selectedIds.length === 1 ? rows.find((r) => r.id === selectedIds[0]) : undefined;
        if (label === 'Select all') onSelectedIdsChange(rows.map((r) => r.id));
        if (label === 'Properties' && only?.href) navigate(only.href);
        if (label === 'Ask AI') setAiOpen(true);
      }}
      onDismiss={() => onSelectedIdsChange([])}
    />
  );
}
