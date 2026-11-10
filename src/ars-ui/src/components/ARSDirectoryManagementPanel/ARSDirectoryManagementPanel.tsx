import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { ViewSwitch, type ViewSwitchItem } from '../../parts/ViewSwitch/ViewSwitch.js';
import {
  ARSDirectoryMultiselect,
  type ARSDirectoryMultiselectProps,
} from '../ARSDirectoryMultiselect/ARSDirectoryMultiselect.js';
import styles from './ARSDirectoryManagementPanel.module.css';

export type ARSDirectoryView = 'flat' | 'tree' | 'favorites';

const VIEWS: ViewSwitchItem[] = [
  { value: 'flat', label: 'Flat view', icon: 'BuildingOffice' },
  { value: 'tree', label: 'Tree view', icon: 'TreeView' },
  { value: 'favorites', label: 'Favorites', icon: 'Star' },
];

export interface ARSDirectoryManagementPanelProps {
  view: ARSDirectoryView;
  onViewChange?: (view: ARSDirectoryView) => void;
  /** Flat view only: the directory picker above the content. */
  directories?: ARSDirectoryMultiselectProps;
  /** ARS_Directory_Management_Content for the view. */
  children: ReactNode;
  className?: string;
}

/**
 * ARS_Directory_Management_Panel — the 254px directory panel: view switch,
 * the directory picker (Flat view) and the view's content. Figma: 2385:54213.
 */
export function ARSDirectoryManagementPanel({
  view,
  onViewChange,
  directories,
  children,
  className,
}: ARSDirectoryManagementPanelProps) {
  return (
    <aside className={cx(styles.root, className)} aria-label="Directory management">
      <ViewSwitch
        ariaLabel="View"
        items={VIEWS}
        value={view}
        onChange={(v) => onViewChange?.(v as ARSDirectoryView)}
      />
      {view === 'flat' && directories && (
        <div className={styles.select}>
          <ARSDirectoryMultiselect {...directories} />
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
