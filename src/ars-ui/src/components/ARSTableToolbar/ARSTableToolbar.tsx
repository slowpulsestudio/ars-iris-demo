import type { MouseEventHandler } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { SplitButton } from '@iris/components/SplitButton/SplitButton.js';
import { SearchInput } from '../../parts/SearchInput/SearchInput.js';
import styles from './ARSTableToolbar.module.css';

export type ARSTableToolbarVariant = 'Split' | 'Basic' | 'No create' | '4';

/** Figma sample label for each variant's main action. */
const ACTION_LABEL: Record<ARSTableToolbarVariant, string | null> = {
  Split: 'Create',
  Basic: 'Button',
  'No create': 'Add user',
  '4': null,
};

export interface ARSTableToolbarProps {
  /** Figma "Vartiant". */
  variant?: ARSTableToolbarVariant;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onFilter?: MouseEventHandler<HTMLElement>;
  /** How many conditions are applied; shown as a badge on the filter button, as in the Advanced Search Figma. */
  filterCount?: number;
  /** The filter panel is open: the button reads as pressed. */
  filterPressed?: boolean;
  /** Main action label; defaults to the Figma text for the variant. */
  actionLabel?: string;
  onAction?: MouseEventHandler<HTMLElement>;
  /** Split variants: the caret beside the main action. */
  onActionMenu?: MouseEventHandler<HTMLElement>;
  /** Adds a "…" icon button before the filter (Groups file Memberships toolbar). */
  showMore?: boolean;
  onMore?: MouseEventHandler<HTMLElement>;
  /** Split variant: hide the main action's Plus icon (the Groups file draws none). */
  hideActionIcon?: boolean;
  className?: string;
}

/** ARS_Table_Toolbar — search, filter and the table's main action. Figma: 2613:23294. */
export function ARSTableToolbar({
  variant = 'Split',
  search,
  onSearchChange,
  searchPlaceholder = 'Search by name, email, object ID etc.',
  onFilter,
  filterCount = 0,
  filterPressed,
  actionLabel,
  onAction,
  onActionMenu,
  showMore = false,
  onMore,
  hideActionIcon = false,
  className,
}: ARSTableToolbarProps) {
  const label = actionLabel ?? ACTION_LABEL[variant];
  const searchBox = <SearchInput placeholder={searchPlaceholder} value={search} onChange={onSearchChange} />;
  const filter = (
    <span className={styles.filter}>
      <IconButton
        icon="FunnelSimple"
        ariaLabel={filterCount > 0 ? `Filters, ${filterCount} applied` : 'Filters'}
        aria-pressed={filterPressed}
        onClick={onFilter}
      />
      {filterCount > 0 && (
        <span className={styles.filterCount} aria-hidden="true">
          {filterCount}
        </span>
      )}
    </span>
  );

  if (variant === 'No create') {
    return (
      <div className={cx(styles.root, styles.spread, className)}>
        <SplitButton onClick={onAction} onMenuClick={onActionMenu} ariaMenuLabel={`More ${label} options`}>
          {label}
        </SplitButton>
        <div className={styles.searchSlot}>{searchBox}</div>
        <div className={styles.filterSlot}>{filter}</div>
      </div>
    );
  }

  if (variant === 'Split') {
    return (
      <div className={cx(styles.root, styles.spread, className)}>
        <div className={styles.searchSlot}>{searchBox}</div>
        {showMore && <IconButton icon="DotsThree" ariaLabel="More options" onClick={onMore} />}
        {filter}
        <SplitButton
          iconLead={hideActionIcon ? undefined : 'Plus'}
          onClick={onAction}
          onMenuClick={onActionMenu}
          ariaMenuLabel={`More ${label} options`}
        >
          {label}
        </SplitButton>
      </div>
    );
  }

  return (
    <div className={cx(styles.root, styles.tight, className)}>
      <div className={styles.searchSlot}>{searchBox}</div>
      {filter}
      {variant === 'Basic' && (
        <Button iconLead="Plus" onClick={onAction}>
          {label}
        </Button>
      )}
    </div>
  );
}
