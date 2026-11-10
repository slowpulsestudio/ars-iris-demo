import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Token layer (order matters: primitives → semantic theme overrides → custom)
import './tokens/tokens.primitives.css';
import './tokens/tokens.light.css';
import './tokens/tokens.dark.css';
import './tokens/tokens.hc-light.css';
import './tokens/tokens.hc-dark.css';
import './tokens/tokens.custom.css';
// "More themes" (popular VS Code themes), kept separate from the core set.
// Imported last so their body.theme-* overrides win over the base light set.
import './tokens/more-themes/index.css';
// Chart categorical series tokens, kept separate from the semantic token files.
import './tokens/charts/tokens.charts.css';
import './tokens/charts/tokens.charts.more-themes.css';

// Base
import './styles/reset.css';
import './styles/typography.css';
import './styles/base.css';
import './styles/scroll.css';

import App from './App.js';
import { readSavedTheme } from './lib/useTheme.js';

// First paint uses the product theme (light unless the user picked another);
// the welcome and Storybooks pages switch to dark before they paint.
document.body.classList.add(`theme-${readSavedTheme()}`);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
