import { useState, type MouseEventHandler } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { SplitButton } from '@iris/components/SplitButton/SplitButton.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import type { Group, ParameterDef } from '@iris/components/Filters/filterModel.js';
import { AdvancedFilterBuilder } from '../AdvancedFilterBuilder/AdvancedFilterBuilder.js';
import { QuerySyntax, type QuerySyntaxOption } from '../QuerySyntax/QuerySyntax.js';
import styles from './AdvancedFilterPanel.module.css';

export type AdvancedFilterPanelView = 'builder' | 'query';

export interface AdvancedFilterPanelProps {
  root: Group;
  parameters: ParameterDef[];
  categories: ParamCategory[];
  actions: FilterModelActions;
  /** Query text per syntax. Adds the "{ }" view that shows the filter as e.g. LDAP. */
  syntaxes?: QuerySyntaxOption[];
  /** Controlled view. Uncontrolled starts on the builder. */
  view?: AdvancedFilterPanelView;
  onViewChange?: (view: AdvancedFilterPanelView) => void;
  onClose?: () => void;
  /** Defaults to clearing the filter tree. */
  onClearAll?: () => void;
  onCancel?: () => void;
  onApply?: () => void;
  /** The chevron beside "Apply filter". */
  onApplyMenu?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

/**
 * AdvancedFilterPanel — the Advanced filter "Panel" (side sheet): header with the builder / query
 * switch, the body, and Clear all / Cancel / Apply filter. Fills its container between 338px and 512px.
 * Figma: Iris UI Kit "panel, min-width" 9722:12155 and "panel, max-width" 9713:9223.
 */
export function AdvancedFilterPanel({
  root,
  parameters,
  categories,
  actions,
  syntaxes,
  view: viewProp,
  onViewChange,
  onClose,
  onClearAll,
  onCancel,
  onApply,
  onApplyMenu,
  className,
}: AdvancedFilterPanelProps) {
  const [internalView, setInternalView] = useState<AdvancedFilterPanelView>('builder');
  const view = viewProp ?? internalView;
  const setView = (next: AdvancedFilterPanelView) => {
    setInternalView(next);
    onViewChange?.(next);
  };

  const views: { id: AdvancedFilterPanelView; label: string; icon: string }[] = [
    { id: 'builder', label: 'Filter builder', icon: 'FunnelSimple' },
    ...(syntaxes?.length ? [{ id: 'query' as const, label: 'Query syntax', icon: 'BracketsCurly' }] : []),
  ];

  return (
    <section className={cx(styles.root, className)} aria-label="Advanced filter">
      <header className={styles.header}>
        <div className={styles.switch} role="group" aria-label="View">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              className={cx(styles.switchItem, view === v.id && styles.selected)}
              aria-label={v.label}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
            >
              <Icon name={v.icon} size="20px" />
            </button>
          ))}
        </div>
        <h2 className={styles.title}>{view === 'query' ? 'Query syntax' : 'Advanced filter'}</h2>
        <IconButton icon="X" ariaLabel="Close" size="s" variant="ghost" onClick={onClose} />
      </header>

      <div className={styles.body}>
        {view === 'query' && syntaxes?.length ? (
          <QuerySyntax syntaxes={syntaxes} />
        ) : (
          <AdvancedFilterBuilder root={root} parameters={parameters} categories={categories} actions={actions} />
        )}
      </div>

      <footer className={styles.footer}>
        <Button variant="ghost" onClick={onClearAll ?? actions.clear}>
          Clear all
        </Button>
        <span className={styles.spacer} />
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <SplitButton onClick={onApply} onMenuClick={onApplyMenu} ariaMenuLabel="More apply options">
          Apply filter
        </SplitButton>
      </footer>
    </section>
  );
}
