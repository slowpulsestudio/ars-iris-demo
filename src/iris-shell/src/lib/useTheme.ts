import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { MORE_THEMES, type MoreThemeValue } from './moreThemes';

export type CoreThemeValue = 'light' | 'dark' | 'hc-light' | 'hc-dark';
export type ThemeValue = CoreThemeValue | MoreThemeValue;

export interface ThemeDef {
  value: ThemeValue;
  label: string;
  icon: string;
  bodyClass: string;
  /** Which switcher group the theme belongs to. Defaults to 'core'. */
  group?: 'core' | 'more';
  /** Optional signature-accent hex, rendered as a colored dot in menus. */
  swatch?: string;
}

const CORE_THEMES: ThemeDef[] = [
  { value: 'light', label: 'Light', icon: 'Sun', bodyClass: 'theme-light', group: 'core' },
  { value: 'dark', label: 'Dark', icon: 'Moon', bodyClass: 'theme-dark', group: 'core' },
  { value: 'hc-light', label: 'High contrast light', icon: 'SunDim', bodyClass: 'theme-hc-light', group: 'core' },
  { value: 'hc-dark', label: 'High contrast dark', icon: 'MoonStars', bodyClass: 'theme-hc-dark', group: 'core' },
];

export const THEMES: ThemeDef[] = [...CORE_THEMES, ...MORE_THEMES];

// The product screens' theme. Renamed from 'ars.theme' when the product default became light.
const STORAGE_KEY = 'ars.productTheme';
const ALL_CLASSES = THEMES.map((t) => t.bodyClass);

/** Set while a page pins its own theme (see useFixedTheme). */
let fixedTheme: ThemeValue | null = null;

/** Apply a theme by swapping the body class. */
function applyTheme(value: ThemeValue): void {
  const next = THEMES.find((t) => t.value === value) ?? THEMES[0];
  document.body.classList.remove(...ALL_CLASSES);
  document.body.classList.add(next.bodyClass);
}

/** The saved product theme, or light. */
export function readSavedTheme(): ThemeValue {
  const saved = localStorage.getItem(STORAGE_KEY);
  return THEMES.some((t) => t.value === saved) ? (saved as ThemeValue) : 'light';
}

/** The body class (unless a page has pinned its own theme), else the saved product theme. */
function readInitialTheme(): ThemeValue {
  if (!fixedTheme) {
    for (const t of THEMES) {
      if (document.body.classList.contains(t.bodyClass)) return t.value;
    }
  }
  return readSavedTheme();
}

export interface UseThemeResult {
  theme: ThemeValue;
  setTheme: (value: ThemeValue) => void;
  themes: ThemeDef[];
}

/**
 * useTheme — controlled-ish hook to switch between the 4 design-system themes.
 */
export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<ThemeValue>(readInitialTheme);

  // Apply on mount and on every change (unless a page pins its own theme); persist user choice.
  useEffect(() => {
    if (!fixedTheme) applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((value: ThemeValue) => setThemeState(value), []);

  return { theme, setTheme, themes: THEMES };
}

/**
 * useFixedTheme — shows a page in one theme regardless of the product theme,
 * and restores the product theme when the page goes away.
 */
export function useFixedTheme(value: ThemeValue): void {
  useLayoutEffect(() => {
    fixedTheme = value;
    applyTheme(value);
    return () => {
      fixedTheme = null;
      applyTheme(readSavedTheme());
    };
  }, [value]);
}
