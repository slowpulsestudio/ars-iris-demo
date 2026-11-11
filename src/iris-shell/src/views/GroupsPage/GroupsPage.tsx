import { useMemo, useState } from 'react';
import { ARSTreeViewADContent } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { useDirectory } from '../../lib/directoryStore.js';
import type { DirectoryNodeView, DirectoryObject } from '../../lib/directoryData.js';
import { getGroupProps } from '../../lib/groupDetailsStore.js';
import { CreateGroupModal } from './CreateGroupModal.js';
import screen from '../ARSScreen/ARSScreen.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];
/** Where a group made from this list goes. */
const DEFAULT_FOLDER = 'o1d-local';

function nodeIds(nodes: DirectoryNodeView[]): string[] {
  return nodes.flatMap((n) => [n.id, ...nodeIds(n.children)]);
}

/**
 * GroupsPage — the Groups list (ARS_Table_Groups): every group in the
 * directory with its group type and description. Rows open the group page.
 */
export function GroupsPage() {
  const directory = useDirectory();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [createOpen, setCreateOpen] = useState(false);

  const groups = useMemo<DirectoryObject[]>(
    () => nodeIds(directory.nodeTree).flatMap((id) => directory.getSiblings(id).filter((o) => o.type === 'group')),
    [directory],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups.filter((g) => !q || [g.name, g.description].some((v) => v.toLowerCase().includes(q)));
  }, [groups, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Groups' }]}>
      <ARSTreeViewADContent
        className={screen.screen}
        header={{ title: 'Groups', icon: 'UsersThree' }}
        toolbar={{
          variant: 'Basic',
          search: query,
          onSearchChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          actionLabel: 'Create',
          onAction: () => setCreateOpen(true),
        }}
        typeLabel="Group type"
        rows={pageRows.map((g) => ({
          id: g.id,
          name: g.name,
          icon: 'UsersThree',
          href: `#/tree/${g.parentId}/${g.id}`,
          objectType: getGroupProps(g).type,
          description: g.description,
        }))}
        selected={selected}
        onSelectionChange={setSelected}
        pagination={{
          page: safePage,
          pageCount,
          onPageChange: setPage,
          pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
      />
      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} kind="AD" locationId={DEFAULT_FOLDER} />
    </AppShell>
  );
}
