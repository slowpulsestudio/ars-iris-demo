import { useState, type MouseEvent } from 'react';
import { ActionBar, type ActionItem } from '@iris/components/ActionBar/ActionBar.js';
import { FolderArrowRightIcon } from '../../parts/FolderArrowRightIcon.js';

export type ARSActionBarVariant = 'Default' | '2' | 'Variant3';

const SELECT_ALL: ActionItem = { icon: 'SelectionAll', label: 'Select all' };
const MOVE: ActionItem = { icon: <FolderArrowRightIcon />, label: 'Move' };
const PROPERTIES: ActionItem = { icon: 'UserList', label: 'Properties' };
const ASK_AI: ActionItem = { icon: 'Sparkle', label: 'Ask AI', tone: 'brand', beam: true };
const MORE: ActionItem = { icon: 'DotsThree', label: 'More actions', iconOnly: true };
const DELETE: ActionItem = { icon: 'Trash', label: 'Delete', tone: 'danger' };

const GROUPS: Record<ARSActionBarVariant, ActionItem[][]> = {
  Default: [[SELECT_ALL, { icon: 'Copy', label: 'Copy' }, MOVE, PROPERTIES, ASK_AI], [DELETE]],
  '2': [[SELECT_ALL, { icon: 'Password', label: 'Reset password' }, MOVE, PROPERTIES, MORE], [DELETE]],
  Variant3: [[SELECT_ALL, MOVE, PROPERTIES, ASK_AI, MORE], [DELETE]],
};

export interface ARSActionBarProps {
  /** Figma "Variant": Default, 2 or Variant3. */
  variant?: ARSActionBarVariant;
  open?: boolean;
  selectedCount?: number;
  totalCount?: number;
  /** Shows "N of total selected" on the Default variant too, as the bulk bar in ARS_WebUI2_CRUD does. */
  showTotal?: boolean;
  /** The "Show selected" toggle (variants 2 and Variant3); uncontrolled unless set. */
  showSelected?: boolean;
  onShowSelectedChange?: (on: boolean) => void;
  /** Called with the label of the pressed action and its button. */
  onAction?: (label: string, event: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: () => void;
  /** Where the bar sits; Figma: 21px above the page bottom, centred in the content area. */
  layout?: 'floating' | 'inline';
  className?: string;
}

/**
 * ARS_Action_bar — the Iris ActionBar with the ARS bulk actions. Variants 2
 * and Variant3 add the total and a "Show selected" toggle. Figma: 2385:59821.
 */
export function ARSActionBar({
  variant = 'Default',
  open = true,
  selectedCount = 5,
  totalCount = 122,
  showTotal,
  showSelected,
  onShowSelectedChange,
  onAction,
  onDismiss,
  layout = 'floating',
  className,
}: ARSActionBarProps) {
  const [localShowSelected, setLocalShowSelected] = useState(false);
  const isDefault = variant === 'Default';
  const toggled = showSelected ?? localShowSelected;
  const groups = GROUPS[variant].map((group) =>
    group.map((item) => ({ ...item, onClick: (e: MouseEvent<HTMLButtonElement>) => onAction?.(item.label, e) })),
  );
  return (
    <ActionBar
      open={open}
      selectedCount={selectedCount}
      totalCount={isDefault && !showTotal ? undefined : totalCount}
      toggle={
        isDefault
          ? undefined
          : {
              label: 'Show selected',
              checked: toggled,
              onChange: (on) => {
                setLocalShowSelected(on);
                onShowSelectedChange?.(on);
              },
            }
      }
      onDismiss={onDismiss}
      groups={groups}
      layout={layout}
      className={className}
    />
  );
}
