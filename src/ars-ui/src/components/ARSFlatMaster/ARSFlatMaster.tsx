import type { AppHeaderProps } from '@iris/components/AppHeader/AppHeader.js';
import { ARSAppLayoutFlatView } from '../ARSAppLayoutFlatView/ARSAppLayoutFlatView.js';
import {
  ARSDirectoryManagementPanel,
  type ARSDirectoryManagementPanelProps,
} from '../ARSDirectoryManagementPanel/ARSDirectoryManagementPanel.js';
import {
  ARSDirectoryManagementContent,
  type ARSDirectoryFlatContentProps,
} from '../ARSDirectoryManagementContent/ARSDirectoryManagementContent.js';
import {
  ARSFlatViewUserContent,
  type ARSFlatViewUserContentProps,
} from '../ARSFlatViewUserContent/ARSFlatViewUserContent.js';

export interface ARSFlatMasterProps {
  header: AppHeaderProps;
  onViewChange?: ARSDirectoryManagementPanelProps['onViewChange'];
  directories?: ARSDirectoryManagementPanelProps['directories'];
  /** Flat view navigation (ARS_Flat_View_Content). */
  nav: Omit<ARSDirectoryFlatContentProps, 'variant'>;
  /** ARS_Flat View_User_Content. */
  content: ARSFlatViewUserContentProps;
  className?: string;
}

/**
 * ARS_Flat_Master — the Flat view screen: ARS_App_Layout_Flat_View with the
 * Flat view panel and ARS_Flat View_User_Content. Figma: 4006:17053.
 */
export function ARSFlatMaster({ header, onViewChange, directories, nav, content, className }: ARSFlatMasterProps) {
  return (
    <ARSAppLayoutFlatView
      className={className}
      header={header}
      panel={
        <ARSDirectoryManagementPanel view="flat" onViewChange={onViewChange} directories={directories}>
          <ARSDirectoryManagementContent variant="flat" {...nav} />
        </ARSDirectoryManagementPanel>
      }
    >
      <ARSFlatViewUserContent {...content} />
    </ARSAppLayoutFlatView>
  );
}
