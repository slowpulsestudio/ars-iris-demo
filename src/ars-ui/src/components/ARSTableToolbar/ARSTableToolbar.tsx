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
  onFilter?: () => void;
  /** Main action label; defaults to the Figma text for the variant. */
  actionLabel?: string;
  onAction?: () => void;
  /** Split variants: the caret beside the main action. */
  onActionMenu?: () => void;
  className?: string;
}

/** ARS_Table_Toolbar — search, filter and the table's main action. Figma: 2613:23294. */
export function ARSTableToolbar({
  variant = 'Split',
  search,
  onSearchChange,
  searchPlaceholder = 'Search by name, email, object ID etc.',
  onFilter,
  actionLabel,
  onAction,
  onActionMenu,
  className,
}: ARSTableToolbarProps) {
  const label = actionLabel ?? ACTION_LABEL[variant];
  const searchBox = <SearchInput placeholder={searchPlaceholder} value={search} onChange={onSearchChange} />;
  const filter = <IconButton icon="FunnelSimple" ariaLabel="Filters" onClick={onFilter} />;

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
        {filter}
        <SplitButton iconLead="Plus" onClick={onAction} onMenuClick={onActionMenu} ariaMenuLabel={`More ${label} options`}>
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
