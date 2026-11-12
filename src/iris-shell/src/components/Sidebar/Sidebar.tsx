import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from '../../lib/cx.js';
import { navigate } from '../../lib/router.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import { useFavorites } from '../../lib/useFavorites.js';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';
import { MultiSelect } from '../MultiSelect/MultiSelect.js';
import { DIRECTORIES, useDirectoryFilter } from '../../lib/directoryFilter.js';
import { NavItem } from '../NavItem/NavItem.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { Tree } from './Tree.js';
import styles from './Sidebar.module.css';

export interface SidebarNavItem {
  value: string;
  label: string;
  icon: string;
}

export interface SidebarProps {
  navItems: SidebarNavItem[];
  activeNav: string;
  onNavChange?: (value: string) => void;
  directoryLabel: string;
  /** Active directory-view segment (Flat/Tree/Favourites), derived from route. */
  view: string;
  onViewChange: (value: string) => void;
  /** Rail width in px. Falls back to the CSS default when omitted. */
  width?: number;
  /** Active-drag styling for the resize handle. */
  dragging?: boolean;
  /** When provided, renders a drag-to-resize handle on the right edge. */
  onResizePointerDown?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  className?: string;
}

const VIEW_OPTIONS = [
  { value: 'flat', label: 'Flat view', icon: 'BuildingOffice' },
  { value: 'tree', label: 'Tree view', icon: 'TreeView' },
  { value: 'favourites', label: 'Favourites', icon: 'Heart', celebrate: true },
];

// Switching entities navigates and remounts this Sidebar, so the indicator
// would snap into place on mount. Remember the previously-active nav value so a
// fresh mount can glide the bar from where it came from.
let lastActiveNav: string | null = null;

export { DIRECTORIES } from '../../lib/directoryFilter.js';

/**
 * Sidebar — directory navigation rail.
 */
export function Sidebar({
  navItems,
  activeNav,
  onNavChange,
  directoryLabel,
  view,
  onViewChange,
  width,
  dragging = false,
  onResizePointerDown,
  className,
}: SidebarProps) {
  const [directories, setDirectories] = useDirectoryFilter();

  // Shared active indicator that slides between nav rows. NavItem's built-in
  // bar is suppressed (hideIndicator) so this single element can animate
  // between positions instead of the per-row bars hard-cutting.
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const didPaintRef = useRef(false);

  // The nav's NavItems render in `navItems` order, so index maps a value to its
  // row element (the indicator span is a <span>, excluded by the selector).
  const rowForValue = (val: string): HTMLElement | null => {
    const nav = navRef.current;
    if (!nav) return null;
    const idx = navItems.findIndex((n) => n.value === val);
    if (idx < 0) return null;
    return nav.querySelectorAll<HTMLElement>('a, button')[idx] ?? null;
  };

  const writeIndicator = (row: HTMLElement, animate: boolean) => {
    const ind = indicatorRef.current;
    if (!ind) return;
    const write = () => {
      ind.style.transform = `translateY(${row.offsetTop}px)`;
      ind.style.height = `${row.offsetHeight}px`;
    };
    if (animate) {
      write();
    } else {
      const prev = ind.style.transition;
      ind.style.transition = 'none';
      write();
      void ind.offsetHeight;
      ind.style.transition = prev;
    }
  };

  const moveIndicator = (animate: boolean) => {
    const nav = navRef.current;
    const ind = indicatorRef.current;
    if (!nav || !ind) return;
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) {
      ind.style.height = '0px';
      return;
    }
    writeIndicator(active, animate);
  };

  useLayoutEffect(() => {
    // Glide from the previously-active row when this control was just remounted
    // by a navigation, instead of snapping the bar to the new position.
    const prev = lastActiveNav;
    const canGlide =
      !didPaintRef.current &&
      prev != null &&
      prev !== activeNav &&
      !prefersReducedMotion() &&
      navItems.some((n) => n.value === prev) &&
      navItems.some((n) => n.value === activeNav);
    const prevRow = canGlide ? rowForValue(prev) : null;
    if (prevRow) {
      writeIndicator(prevRow, false);
      requestAnimationFrame(() => moveIndicator(true));
    } else {
      moveIndicator(didPaintRef.current);
    }
    didPaintRef.current = true;
    lastActiveNav = activeNav;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav, navItems]);

  useEffect(() => {
    const onResize = () => moveIndicator(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className={cx(styles.sidebar, className)}
      style={width ? ({ '--directory-sidebar-width': `${width}px` } as CSSProperties) : undefined}
      aria-label="Directory"
    >
      {onResizePointerDown &&
        (dragging ? (
          <button
            type="button"
            aria-label="Resize sidebar"
            className={cx(styles.resizeHandle, styles.resizeHandleDragging)}
            onPointerDown={onResizePointerDown}
            onClick={(e) => e.preventDefault()}
          >
            <span className={styles.resizeHandleGrip} aria-hidden="true" />
          </button>
        ) : (
          <Tooltip label="Drag to resize" placement="bottom" delay={150} followCursor>
            <button
              type="button"
              aria-label="Resize sidebar"
              className={styles.resizeHandle}
              onPointerDown={onResizePointerDown}
              onClick={(e) => e.preventDefault()}
            >
              <span className={styles.resizeHandleGrip} aria-hidden="true" />
            </button>
          </Tooltip>
        ))}

      <div className={styles.sidebarSurface}>
        <div className={styles.viewSwitch}>
          <SegmentedControl
            items={VIEW_OPTIONS}
            value={view}
            onChange={onViewChange}
            ariaLabel="Directory view"
          />
        </div>

        {view === 'tree' ? (
          <Tree />
        ) : view === 'favourites' ? (
          <FavouritesBody />
        ) : (
          <>
            <div className={styles.selectBlock}>
              <MultiSelect
                label={directories.size === 0 ? 'No directories' : directoryLabel}
                ariaLabel="Filter by directory"
                searchPlaceholder="Search directories"
                options={DIRECTORIES}
                selected={directories}
                onSelectionChange={setDirectories}
                className={styles.directorySelect}
              />
            </div>

            <nav ref={navRef} className={styles.nav} aria-label="Directory entities">
              <span ref={indicatorRef} aria-hidden="true" className={styles.navIndicator} />
              {navItems.map((item) => (
                <NavItem
                  key={item.value}
                  icon={item.icon}
                  label={item.label}
                  selected={item.value === activeNav}
                  hideIndicator
                  onClick={() => onNavChange?.(item.value)}
                />
              ))}
            </nav>
          </>
        )}
      </div>
    </aside>
  );
}

/** Favourites segment body — shortcuts to favorited objects. */
function FavouritesBody() {
  const { entries } = useFavorites();

  if (entries.length === 0) {
    return (
      <nav className={styles.nav} aria-label="Favourites">
        <p className={styles.favEmpty}>No favourites yet. Star an object to pin it here.</p>
      </nav>
    );
  }

  return (
    <nav className={styles.nav} aria-label="Favourites">
      {entries.map((f) => (
        <NavItem
          key={f.id}
          icon="Heart"
          label={f.name}
          hideIndicator
          onClick={() => navigate(f.href)}
        />
      ))}
    </nav>
  );
}
