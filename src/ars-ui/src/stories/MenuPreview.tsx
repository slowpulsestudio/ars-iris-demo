import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import type { MenuTriggerArgs } from '@iris/components/Menu/Menu.js';

interface MenuState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Story-only: keeps an ARS menu open from the start, with room below it for the popover. */
export function MenuPreview({ height = 480, children }: { height?: number; children: (state: MenuState) => ReactNode }) {
  const [open, setOpen] = useState(true);
  return <div style={{ minHeight: height }}>{children({ open, onOpenChange: setOpen })}</div>;
}

/** Story-only: an Iris icon button that opens the menu, like the ones in the ARS rows and headers. */
export function iconTrigger(icon: string, ariaLabel: string) {
  return ({ ref, onClick, expanded }: MenuTriggerArgs) => (
    <IconButton
      ref={ref as Ref<HTMLButtonElement>}
      icon={icon}
      ariaLabel={ariaLabel}
      aria-haspopup="menu"
      aria-expanded={expanded}
      onClick={onClick}
    />
  );
}

interface ContextMenuState extends MenuState {
  position: { x: number; y: number } | undefined;
}

/** Story-only: a folder row that opens the menu where it's right-clicked; starts open under the row. */
export function ContextMenuPreview({ label, children }: { label: string; children: (state: ContextMenuState) => ReactNode }) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>();

  useLayoutEffect(() => {
    const r = rowRef.current?.getBoundingClientRect();
    if (r) {
      setPosition({ x: r.left + r.height, y: r.bottom });
      setOpen(true);
    }
  }, []);

  return (
    <div style={{ minHeight: 360 }}>
      <div
        ref={rowRef}
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--oi-spacing-s)',
          padding: 'var(--oi-spacing-xs) var(--oi-spacing-s)',
          borderRadius: 'var(--oi-border-radius-default)',
          backgroundColor: 'var(--oi-background-color-secondary)',
          color: 'var(--oi-content-color-primary)',
          font: 'inherit',
          cursor: 'context-menu',
        }}
      >
        <Icon name="Folder" size="16px" />
        {label}
      </div>
      {children({ open, onOpenChange: setOpen, position })}
    </div>
  );
}
