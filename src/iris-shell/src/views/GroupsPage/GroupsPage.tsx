import { useMemo, useState } from 'react';
import { ARSTableGroups } from '@ars';
import { AppShell } from '../AppShell/AppShell.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { setHashParams, useHashParam, useHashSelection } from '../../lib/hashState.js';
import type { DirectoryNodeView, DirectoryObject } from '../../lib/directoryData.js';
import { DEPARTMENT_NAMES } from '../../lib/directoryData.js';
import { getGroupProps } from '../../lib/groupDetailsStore.js';
import { CreateGroupModal } from './CreateGroupModal.js';
import screen from '../ARSScreen/ARSScreen.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];
/** Where a group made from this list goes. */
const DEFAULT_FOLDER = 'o1d-local';
// Figma's sample tag pairs (ARS_Table_Groups) for groups that aren't named "[Department] [Role]";
// the directory data has no tags, so those groups take them in turn.
const TAG_PAIRS = [
  ['Security', 'Compliance'],
  ['Marketing', 'Strategy'],
  ['Engineering', 'DevOps'],
  ['Security', 'Administrator'],
  ['Sales', 'Revenue'],
  ['Support', 'Services'],
  ['Product', 'Strategy'],
  ['HR', 'Operations'],
  ['IT', 'Infrastructure'],
  ['Finance', 'Compliance'],
  ['Leadership', 'Strategy'],
  ['QA', 'Engineering'],
  ['Analytics', 'Data'],
  ['Cloud', 'Operations'],
  ['Legal', 'Compliance'],
];

function nodeIds(nodes: DirectoryNodeView[]): string[] {
  return nodes.flatMap((n) => [n.id, ...nodeIds(n.children)]);
}

/**
 * GroupsPage — the Groups list (ARS_Table_Groups 158:33464): every group in
 * the directory with its type, description, tags and folder. Rows open the group page.
 */
export function GroupsPage() {
  const directory = useDirectory();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useHashSelection();
  // The New AD Group dialog lives in the address (?dialog=new-group).
  const [dialog] = useHashParam('dialog');
  const createOpen = dialog === 'new-group';
  const setCreateOpen = (open: boolean) => setHashParams({ dialog: open ? 'new-group' : null });
  const [removedTags, setRemovedTags] = useState<Map<string, Set<string>>>(() => new Map());

  // Only groups inside a directory (under Managed Directories); the Access Templates and Managed Units folders aren't directories.
  const groups = useMemo<DirectoryObject[]>(
    () =>
      nodeIds(directory.nodeTree)
        .filter((id) => directory.getPath(id)[0]?.id === 'managed-directories')
        .flatMap((id) => directory.getSiblings(id).filter((o) => o.type === 'group')),
    [directory],
  );
  const tagsFor = useMemo(() => {
    const index = new Map(groups.map((g, i) => [g.id, i]));
    const byId = new Map(groups.map((g) => [g.id, g]));
    const topics = [...new Set(TAG_PAIRS.map((p) => p[1]))];
    return (id: string) => {
      const i = index.get(id) ?? 0;
      // A "[Department] [Role]" group is tagged with its department plus a topic; other names use Figma's pairs.
      const first = byId.get(id)?.name.split(' ')[0] ?? '';
      const known = DEPARTMENT_NAMES.has(first);
      const topic = topics.filter((t) => t !== first)[(i * 5) % (topics.length - 1)];
      const pair = known ? [first, topic] : TAG_PAIRS[i % TAG_PAIRS.length];
      return pair.filter((t) => !removedTags.get(id)?.has(t));
    };
  }, [groups, removedTags]);

  // Figma's Directory column: "AD1\Groups" (directory, then folders) or "Entra1" (the directory only).
  const describe = (g: DirectoryObject) => {
    const path = directory.getPath(g.parentId);
    const entra = path[1]?.id === 'entra-directories';
    const fromDirectory = path.slice(2).map((p) => p.name);
    return {
      groupType: entra ? 'O365Group' : `${getGroupProps(g).type}Group`,
      directory: (entra ? fromDirectory.slice(0, 1) : fromDirectory).join('\\'),
    };
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups.filter((g) => !q || [g.name, g.description].some((v) => v.toLowerCase().includes(q)));
  }, [groups, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Groups' }]}>
      <ARSTableGroups
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
        rows={pageRows.map((g) => ({
          id: g.id,
          name: g.name,
          href: `#/tree/${g.parentId}/${g.id}`,
          description: g.description,
          tags: tagsFor(g.id),
          ...describe(g),
        }))}
        onRemoveTag={(id, tag) =>
          setRemovedTags((prev) => new Map(prev).set(id, new Set([...(prev.get(id) ?? []), tag])))
        }
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
