import { GlobalSidebar } from '@iris/components/GlobalSidebar/GlobalSidebar.js';

export interface ARSSidebarProps {
  open?: boolean;
  /** Current product, e.g. "directory". */
  activeItem?: string;
  onItemChange?: (value: string) => void;
  className?: string;
}

/**
 * ARS_Sidebar — the Iris UI Kit Sidebar (Active Roles), i.e. the Iris
 * GlobalSidebar pinned open. Figma: 2385:56389.
 */
export function ARSSidebar({ open = true, activeItem = 'directory', onItemChange, className }: ARSSidebarProps) {
  return (
    <GlobalSidebar
      open={open}
      mode="pinned"
      activeItem={activeItem}
      onItemChange={onItemChange}
      className={className}
    />
  );
}
