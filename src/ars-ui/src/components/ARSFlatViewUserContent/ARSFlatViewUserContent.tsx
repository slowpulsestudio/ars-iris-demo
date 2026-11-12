import type { ReactNode } from 'react';
import { ARSTable, type ARSTableProps } from '../ARSTable/ARSTable.js';
import type { ARSHeaderProps } from '../ARSHeader/ARSHeader.js';
import type { ARSTableToolbarProps } from '../ARSTableToolbar/ARSTableToolbar.js';
import { ContentScreen } from '../../parts/ContentScreen/ContentScreen.js';

export interface ARSFlatViewUserContentProps {
  /** ARS_Header; Figma uses Variant1 with the User icon. */
  header: ARSHeaderProps;
  /** ARS_Table_Toolbar; Figma uses the "Basic" variant. */
  toolbar?: ARSTableToolbarProps;
  /** Applied-filter pills between the toolbar and the table (not drawn in Figma). */
  filters?: ReactNode;
  /** Whether the pill row is open; it opens and closes with a height transition. */
  filtersOpen?: boolean;
  /** ARS_Table (Default columns). */
  table: Omit<ARSTableProps, 'variant'>;
  /** Shown in place of the table, e.g. an empty state. Not drawn in Figma. */
  empty?: ReactNode;
  className?: string;
}

/**
 * ARS_Flat View_User_Content — the Flat view list of users: ARS_Header,
 * ARS_Table_Toolbar and ARS_Table. Figma: 3423:30755.
 */
export function ARSFlatViewUserContent({ header, toolbar, filters, filtersOpen, table, empty, className }: ARSFlatViewUserContentProps) {
  return (
    <ContentScreen header={{ icon: 'User', ...header }} toolbar={toolbar} filters={filters} filtersOpen={filtersOpen} className={className}>
      {empty ?? <ARSTable variant="Default" {...table} />}
    </ContentScreen>
  );
}
