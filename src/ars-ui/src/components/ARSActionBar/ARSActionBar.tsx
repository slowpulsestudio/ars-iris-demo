import { useState } from 'react';
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
  onDismiss,
  layout = 'floating',
  className,
}: ARSActionBarProps) {
  const [showSelected, setShowSelected] = useState(false);
  const isDefault = variant === 'Default';
  return (
    <ActionBar
      open={open}
      selectedCount={selectedCount}
      totalCount={isDefault ? undefined : totalCount}
      toggle={isDefault ? undefined : { label: 'Show selected', checked: showSelected, onChange: setShowSelected }}
      onDismiss={onDismiss}
      groups={GROUPS[variant]}
      layout={layout}
      className={className}
    />
  );
}
