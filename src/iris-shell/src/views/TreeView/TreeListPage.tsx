import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  ARSADRightClickTreeMenu,
  ARSADUserActions,
  ARSActionBar,
  ARSEmptyContent,
  ARSFilterMenu,
  ARSNewObjectMenu,
  ARSPageMenu,
  ARSTreeViewADContent,
} from '@ars';
import { NEW_OBJECT_MENU } from '@ars/components/ARSNewObjectMenu/ARSNewObjectMenu.js';
import { AppShell } from '../AppShell/AppShell.js';
import { navigate } from '../../lib/router.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { useAnchoredMenu } from '../../lib/useAnchoredMenu.js';
import { Button } from '../../components/Button/Button.js';
import type { Crumb } from '../../components/AppHeader/AppHeader.js';
import { ResetPasswordModal } from '../ObjectModals/ResetPasswordModal.js';
import { DeleteObjectModal } from '../ObjectModals/DeleteObjectModal.js';
import { CreateObjectModal, type CreateObjectResult } from '../UsersPage/CreateObjectModal/CreateObjectModal.js';
import {
  announceCreated,
  directoryObjectFromValues,
  objectTypeFromMenuLabel,
} from '../UsersPage/CreateObjectModal/createdObject.js';
import screen from '../ARSScreen/ARSScreen.module.css';
import styles from './TreeView.module.css';

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];

/** Icon of each New object menu entry, by label. */
const NEW_OBJECT_ICONS = new Map(
  NEW_OBJECT_MENU.flatMap((row) => (row === 'divider' || !row.icon ? [] : [[row.label, row.icon] as const])),
);

/** Href for a row: containers drill in; leaves open detail. */
function hrefFor(obj: DirectoryObject, nodeId: string): string {
  return obj.isContainer ? `#/tree/${obj.id}` : `#/tree/${nodeId}/${obj.id}`;
}

export interface TreeListPageProps {
  nodeId: string;
}

/**
 * TreeListPage — Directory Management, Tree view: the contents of a folder
 * (Tree_View_AD_Content) inside the shell's directory layout.
 */
export function TreeListPage({ nodeId }: TreeListPageProps) {
  const { isContainer, getChildren, getPath, getNodeName, getNodeIcon, addObject, removeObject } = useDirectory();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [showSelected, setShowSelected] = useState(false);
  const [resetTarget, setResetTarget] = useState<DirectoryObject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DirectoryObject | null>(null);
  // Which object type the Create flow is building. `null` = closed.
  const [createTarget, setCreateTarget] = useState<{ type: string; icon: string } | null>(null);

  const [rowObject, setRowObject] = useState<DirectoryObject | null>(null);
  const rowMenu = useAnchoredMenu();
  const filterMenu = useAnchoredMenu();
  const createMenu = useAnchoredMenu();
  const pageMenu = useAnchoredMenu();

  // Reset transient view state when the selected node changes.
  useEffect(() => {
    setQuery('');
    setPage(1);
    setSelected(new Set());
    setShowSelected(false);
  }, [nodeId]);

  const nodeName = getNodeName(nodeId);
  const known = isContainer(nodeId);

  const allRows = useMemo<DirectoryObject[]>(
    () => (known ? getChildren(nodeId) : []),
    [known, getChildren, nodeId],
  );

  const rows = useMemo<DirectoryObject[]>(() => {
    const q = query.trim().toLowerCase();
    const matching = q
      ? allRows.filter((o) =>
          [o.name, OBJECT_TYPE_META[o.type].label, o.description].some((v) => v.toLowerCase().includes(q)),
        )
      : allRows;
    return showSelected ? matching.filter((o) => selected.has(o.id)) : matching;
  }, [allRows, query, showSelected, selected]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = useMemo<DirectoryObject[]>(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize],
  );

  // Changing the page size keeps the first visible row in view.
  const handlePageSizeChange = (nextSize: number) => {
    const firstVisibleIndex = (safePage - 1) * pageSize;
    setPageSize(nextSize);
    setPage(Math.floor(firstVisibleIndex / nextSize) + 1);
  };

  const toggleRowFavorite = (o: DirectoryObject) =>
    toggleFavorite({
      id: o.id,
      name: o.name,
      type: OBJECT_TYPE_META[o.type].label,
      description: o.description,
      href: hrefFor(o, nodeId),
    });

  const onRowAction = (label: string) => {
    if (!rowObject) return;
    if (label === 'Reset Password') setResetTarget(rowObject);
    if (label === 'Delete') setDeleteTarget(rowObject);
    if (label === 'Add to Favorites') toggleRowFavorite(rowObject);
  };

  const onPageAction = (label: string) => {
    if (label === 'Add to Favorites') {
      toggleFavorite({ id: nodeId, name: nodeName ?? 'Directory', type: 'Folder', href: `#/tree/${nodeId}` });
    }
  };

  const openCreate = (label: string) => {
    const type = objectTypeFromMenuLabel(label);
    if (type) setCreateTarget({ type, icon: NEW_OBJECT_ICONS.get(label) ?? 'User' });
  };

  const selectedObjects = allRows.filter((o) => selected.has(o.id));
  const onBarAction = (label: string, e: MouseEvent<HTMLButtonElement>) => {
    const only = selectedObjects.length === 1 ? selectedObjects[0] : null;
    if (label === 'Select all') setSelected(new Set(allRows.map((o) => o.id)));
    if (label === 'Reset password' && only) setResetTarget(only);
    if (label === 'Delete' && only) setDeleteTarget(only);
    if (label === 'More actions' && only) {
      setRowObject(only);
      rowMenu.openAt(e);
    }
  };

  const onCreated = (result: CreateObjectResult) => {
    if (!result.locationId) {
      announceCreated(result);
      return;
    }
    const object = directoryObjectFromValues(result, result.locationId);
    addObject(result.locationId, object);
    announceCreated(result, `#/tree/${result.locationId}/${object.id}`);
  };

  const breadcrumb = useMemo<Crumb[]>(() => {
    const path = getPath(nodeId);
    const crumbs: Crumb[] = [{ label: 'Directory Management' }];
    if (path.length > 1) crumbs.push({ label: '…' });
    const current = path[path.length - 1];
    crumbs.push({ label: current?.name ?? nodeName ?? 'Unknown' });
    return crumbs;
  }, [getPath, nodeId, nodeName]);

  if (!known) {
    return (
      <AppShell breadcrumb={[{ label: 'Directory Management' }, { label: 'Not found' }]}>
        <div className={styles.missing}>
          <h1 className={styles.missingTitle}>Directory not found</h1>
          <p className={styles.missingBody}>
            We couldn’t find a directory or folder with id <code>{nodeId}</code>.
          </p>
          <Button variant="secondary" onClick={() => navigate('#/tree')}>
            Back to Directory
          </Button>
        </div>
      </AppShell>
    );
  }

  const RowActions = rowObject && (rowObject.type === 'user' || rowObject.type === 'contact')
    ? ARSADUserActions
    : ARSADRightClickTreeMenu;
  const header = { title: nodeName ?? 'Directory', icon: getNodeIcon(nodeId), onMore: pageMenu.openAt };
  const toolbar = {
    variant: 'Split' as const,
    search: query,
    onSearchChange: (value: string) => {
      setQuery(value);
      setPage(1);
    },
    onFilter: filterMenu.openAt,
    onAction: createMenu.openAt,
    onActionMenu: createMenu.openAt,
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      {allRows.length === 0 ? (
        <ARSEmptyContent
          className={screen.screen}
          header={{ ...header, objectClass: 'Folder' }}
          toolbar={toolbar}
          message="This folder has no objects."
          actionLabel="Add object"
          onAction={() => setCreateTarget({ type: 'User', icon: 'User' })}
        />
      ) : (
        <ARSTreeViewADContent
          className={screen.screen}
          header={header}
          toolbar={toolbar}
          rows={pageRows.map((o) => ({
            id: o.id,
            name: o.name,
            icon: OBJECT_TYPE_META[o.type].icon,
            href: hrefFor(o, nodeId),
            objectType: OBJECT_TYPE_META[o.type].label,
            description: o.description,
          }))}
          selected={selected}
          onSelectionChange={setSelected}
          onMore={(id, e) => {
            setRowObject(allRows.find((o) => o.id === id) ?? null);
            rowMenu.openAt(e);
          }}
          pagination={{
            page: safePage,
            pageCount,
            onPageChange: setPage,
            pageSize,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      )}

      <RowActions {...rowMenu.menuProps} ariaLabel={`Actions for ${rowObject?.name ?? 'object'}`} onAction={onRowAction} />
      <ARSFilterMenu {...filterMenu.menuProps} />
      <ARSPageMenu {...pageMenu.menuProps} onAction={onPageAction} />
      <ARSNewObjectMenu {...createMenu.menuProps} onAction={openCreate} />

      <ARSActionBar
        variant={selectedObjects.length === 1 ? '2' : 'Default'}
        open={selected.size > 0}
        selectedCount={selected.size}
        totalCount={allRows.length}
        showTotal
        showSelected={showSelected}
        onShowSelectedChange={setShowSelected}
        layout="inline"
        onAction={onBarAction}
        onDismiss={() => {
          setSelected(new Set());
          setShowSelected(false);
        }}
      />

      {resetTarget && (
        <ResetPasswordModal
          open
          onClose={() => setResetTarget(null)}
          user={{ name: resetTarget.details.displayName || resetTarget.name }}
          location={nodeName ?? 'Directory'}
        />
      )}
      {deleteTarget && (
        <DeleteObjectModal
          open
          onClose={() => setDeleteTarget(null)}
          objectClass={OBJECT_TYPE_META[deleteTarget.type].label}
          name={deleteTarget.name}
          location={nodeName ?? 'Directory'}
          onDeleted={() => {
            removeObject(nodeId, deleteTarget.id);
            setSelected((s) => {
              const next = new Set(s);
              next.delete(deleteTarget.id);
              return next;
            });
          }}
        />
      )}
      {createTarget && (
        <CreateObjectModal
          open
          onClose={() => setCreateTarget(null)}
          objectType={createTarget.type}
          icon={createTarget.icon}
          locationId={nodeId}
          onCreate={onCreated}
        />
      )}
    </AppShell>
  );
}
