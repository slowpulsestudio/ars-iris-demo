import type { AppHeaderProps } from '@iris/components/AppHeader/AppHeader.js';
import { ARSAppLayoutFlatView } from '../ARSAppLayoutFlatView/ARSAppLayoutFlatView.js';
import {
  ARSDirectoryManagementPanel,
  type ARSDirectoryManagementPanelProps,
} from '../ARSDirectoryManagementPanel/ARSDirectoryManagementPanel.js';
import {
  ARSDirectoryManagementContent,
  type ARSDirectoryTreeContentProps,
} from '../ARSDirectoryManagementContent/ARSDirectoryManagementContent.js';
import {
  ARSTreeViewADContent,
  type ARSTreeViewADContentProps,
} from '../ARSTreeViewADContent/ARSTreeViewADContent.js';

export interface ARSTreeviewMasterProps {
  header: AppHeaderProps;
  onViewChange?: ARSDirectoryManagementPanelProps['onViewChange'];
  /** Tree view navigation (ARS_Tree_*_Content). */
  tree: Omit<ARSDirectoryTreeContentProps, 'variant'>;
  /** Tree_View_AD_Content. */
  content: ARSTreeViewADContentProps;
  className?: string;
}

/**
 * ARS_Treeview_Master — the Tree view screen: the application layout with the
 * Tree view panel and Tree_View_AD_Content. Figma: 3367:42088.
 */
export function ARSTreeviewMaster({ header, onViewChange, tree, content, className }: ARSTreeviewMasterProps) {
  return (
    <ARSAppLayoutFlatView
      className={className}
      header={header}
      panel={
        <ARSDirectoryManagementPanel view="tree" onViewChange={onViewChange}>
          <ARSDirectoryManagementContent variant="tree" {...tree} />
        </ARSDirectoryManagementPanel>
      }
    >
      <ARSTreeViewADContent {...content} />
    </ARSAppLayoutFlatView>
  );
}
