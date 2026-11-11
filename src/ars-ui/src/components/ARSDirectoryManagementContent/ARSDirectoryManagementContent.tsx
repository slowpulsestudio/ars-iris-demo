import { cx } from '@iris/lib/cx.js';
import { NavItem } from '@iris/components/NavItem/NavItem.js';
import { Tree, type TreeNode, type TreeProps } from '@iris/components/Tree/Tree.js';
import { SearchInput } from '../../parts/SearchInput/SearchInput.js';
import styles from './ARSDirectoryManagementContent.module.css';

export interface ARSDirectoryNavItem {
  id: string;
  label: string;
  icon: string;
}

export interface ARSDirectoryFavoritesSection {
  title: string;
  items: ARSDirectoryNavItem[];
}

interface CommonProps {
  /** Selected item or node id. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

/** ARS_Flat_View_Content: a list of Iris NavItems. */
export interface ARSDirectoryFlatContentProps extends CommonProps {
  variant: 'flat';
  items: ARSDirectoryNavItem[];
}

/** ARS_Tree_*_Content: the Iris Tree with the ARS settings. */
export interface ARSDirectoryTreeContentProps extends CommonProps {
  variant: 'tree';
  nodes: TreeNode[];
  defaultExpandedIds?: Iterable<string>;
  expandedIds?: ReadonlySet<string>;
  onExpandedChange?: TreeProps['onExpandedChange'];
  onContextMenu?: TreeProps['onContextMenu'];
  onMove?: TreeProps['onMove'];
  canMove?: TreeProps['canMove'];
  externalDropType?: TreeProps['externalDropType'];
  canExternalDrop?: TreeProps['canExternalDrop'];
  onExternalDrop?: TreeProps['onExternalDrop'];
}

/** Favorites: search plus titled sections of Iris NavItems. */
export interface ARSDirectoryFavoritesContentProps extends CommonProps {
  variant: 'favorites';
  sections: ARSDirectoryFavoritesSection[];
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export type ARSDirectoryManagementContentProps =
  | ARSDirectoryFlatContentProps
  | ARSDirectoryTreeContentProps
  | ARSDirectoryFavoritesContentProps;

/**
 * ARS_Directory_Management_Content — the body of the directory panel in its
 * three views. Figma: 3563:17386 (variants ARS_Flat_View_Content 3563:17382,
 * ARS_Tree_AD_Expand_Content 3563:17383, ARS_Tree_Closed_Content 3563:17384,
 * ARS_Tree_Expand_Content 3563:17385, Favorites 3991:36687).
 */
export function ARSDirectoryManagementContent(props: ARSDirectoryManagementContentProps) {
  const { selectedId, onSelect, className } = props;

  if (props.variant === 'tree') {
    return (
      <div className={cx(styles.treeRoot, className)}>
        <Tree
          className={styles.tree}
          ariaLabel="Directories"
          nodes={props.nodes}
          selectedId={selectedId}
          onSelect={onSelect}
          defaultExpandedIds={props.defaultExpandedIds}
          expandedIds={props.expandedIds}
          onExpandedChange={props.onExpandedChange}
          onContextMenu={props.onContextMenu}
          onMove={props.onMove}
          canMove={props.canMove}
          externalDropType={props.externalDropType}
          canExternalDrop={props.canExternalDrop}
          onExternalDrop={props.onExternalDrop}
        />
      </div>
    );
  }

  const navItem = (item: ARSDirectoryNavItem) => (
    <li key={item.id}>
      <NavItem
        icon={item.icon}
        label={item.label}
        selected={item.id === selectedId}
        onClick={() => onSelect?.(item.id)}
      />
    </li>
  );

  if (props.variant === 'flat') {
    return (
      <nav className={cx(styles.flat, className)} aria-label="Directory objects">
        <ul className={styles.list}>{props.items.map(navItem)}</ul>
      </nav>
    );
  }

  return (
    <div className={cx(styles.favorites, className)}>
      <SearchInput
        placeholder={props.searchPlaceholder ?? 'Search by name'}
        value={props.search}
        onChange={props.onSearchChange}
        ariaLabel="Search favorites"
      />
      {props.sections.map((section) => (
        <section key={section.title} className={styles.section} aria-label={section.title}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <ul className={styles.list}>{section.items.map(navItem)}</ul>
        </section>
      ))}
    </div>
  );
}
