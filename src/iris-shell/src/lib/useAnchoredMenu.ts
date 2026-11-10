import { useCallback, useState, type MouseEvent } from 'react';

/** Props to spread on an Iris `Menu` (or an ARS menu) so it opens under the element that was pressed. */
export function useAnchoredMenu() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const openAt = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.bottom + 4 });
  }, []);

  const menuProps = {
    open: position !== null,
    position: position ?? undefined,
    onOpenChange: (open: boolean) => {
      if (!open) setPosition(null);
    },
  };

  return { openAt, menuProps };
}
