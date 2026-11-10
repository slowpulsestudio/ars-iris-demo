import type { Ref } from 'react';
import { SplitButton } from '@iris/components/SplitButton/SplitButton.js';
import type { ARSMenuProps } from '../../parts/menu.js';
import { ARSCreateMenu } from '../ARSCreateMenu/ARSCreateMenu.js';

export interface ARSCreateMenuButtonProps extends Omit<ARSMenuProps, 'trigger'> {
  /** The main "Create" part of the button. */
  onCreate?: () => void;
}

/**
 * ARS_Create_Menu_Button — "+ Create" with an arrow that opens the Create menu
 * (Figma pairs them in OU_Create_menu_button). Built on the Iris SplitButton,
 * whose own hover and pressed styles are Figma's Hover and Active states.
 * Figma: 3360:40921.
 */
export function ARSCreateMenuButton({ onCreate, align = 'start', ...menuProps }: ARSCreateMenuButtonProps) {
  return (
    <ARSCreateMenu
      {...menuProps}
      align={align}
      trigger={({ ref, onClick, expanded }) => (
        <span ref={ref as Ref<HTMLSpanElement>} style={{ display: 'inline-flex' }}>
          <SplitButton
            iconLead="Plus"
            onClick={onCreate}
            onMenuClick={onClick}
            expanded={expanded}
            ariaMenuLabel="Create menu"
          >
            Create
          </SplitButton>
        </span>
      )}
    />
  );
}
