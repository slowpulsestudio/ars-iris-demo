import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';

// Iris token layer, in the same order as the app's main.tsx.
import '@iris/tokens/tokens.primitives.css';
import '@iris/tokens/tokens.light.css';
import '@iris/tokens/tokens.dark.css';
import '@iris/tokens/tokens.hc-light.css';
import '@iris/tokens/tokens.hc-dark.css';
import '@iris/tokens/tokens.custom.css';
import '@iris/tokens/more-themes/index.css';
import '@iris/tokens/charts/tokens.charts.css';
import '@iris/tokens/charts/tokens.charts.more-themes.css';
import '@iris/styles/reset.css';
import '@iris/styles/typography.css';
import '@iris/styles/base.css';
import '@iris/styles/scroll.css';

const THEMES = [
  { value: 'light', title: 'Light' },
  { value: 'dark', title: 'Dark' },
  { value: 'hc-light', title: 'High contrast light' },
  { value: 'hc-dark', title: 'High contrast dark' },
];

const withIrisTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as string;
  useEffect(() => {
    document.body.classList.remove(...THEMES.map((t) => `theme-${t.value}`));
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Iris theme',
      toolbar: { title: 'Theme', icon: 'paintbrush', items: THEMES, dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withIrisTheme],
  parameters: { layout: 'padded' },
};

export default preview;
