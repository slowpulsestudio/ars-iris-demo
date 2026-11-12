import { useState, type CSSProperties } from 'react';
import { useFilterModel } from '@iris/components/Filters/useFilterModel.js';
import type { Group } from '@iris/components/Filters/filterModel.js';
import { AdvancedFilterBar } from '../components/AdvancedFilterBar/AdvancedFilterBar.js';
import { AdvancedFilterPanel, type AdvancedFilterPanelView } from '../components/AdvancedFilterPanel/AdvancedFilterPanel.js';
import { FilterTrigger } from '../components/FilterTrigger/FilterTrigger.js';
import { CATEGORIES, PARAMETERS, syntaxesFor } from './filterSamples.js';

const FIGMA_PANEL_HEIGHT = 736;

export interface PanelHarnessProps {
  initial: () => Group;
  /** Container width. The Figma frames are 338 (min-width) and 512 (max-width). */
  width?: number;
  view?: AdvancedFilterPanelView;
  withQuery?: boolean;
}

/** Holds the filter tree in state so the panel is live in Storybook. */
export function PanelHarness({ initial, width = 512, view, withQuery = true }: PanelHarnessProps) {
  const [seed] = useState(initial);
  const { root, actions } = useFilterModel(seed);
  const style: CSSProperties = { width, height: FIGMA_PANEL_HEIGHT };
  return (
    <div style={style}>
      <AdvancedFilterPanel
        root={root}
        parameters={PARAMETERS}
        categories={CATEGORIES}
        actions={actions}
        syntaxes={withQuery ? syntaxesFor(root) : undefined}
        view={view}
      />
    </div>
  );
}

/** The Bar under a content header row, with the Filter trigger showing its dot when a filter is on. */
export function BarHarness({ initial }: { initial: () => Group }) {
  const [seed] = useState(initial);
  const { root, actions } = useFilterModel(seed);
  return (
    <div style={{ width: 1016, background: 'var(--oi-background-color-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--oi-spacing-m) var(--oi-spacing-xl)' }}>
        <FilterTrigger active={root.children.length > 0} />
      </div>
      <AdvancedFilterBar root={root} parameters={PARAMETERS} actions={actions} showEmpty />
    </div>
  );
}
