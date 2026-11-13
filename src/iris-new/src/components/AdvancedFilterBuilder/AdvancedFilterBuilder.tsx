import type { Ref } from 'react';
import { Button } from '@iris/components/Button/Button.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { Menu } from '@iris/components/Menu/Menu.js';
import type { ParamCategory } from '@iris/components/Filters/AdvancedFilter.js';
import type { FilterModelActions } from '@iris/components/Filters/useFilterModel.js';
import { newCondition, type Group, type ParameterDef } from '@iris/components/Filters/filterModel.js';
import { cx } from '@iris/lib/cx.js';
import { addFilterMenu } from '../../lib/addFilterMenu.js';
import { EmptyFilterGraphic } from '../EmptyFilterGraphic/EmptyFilterGraphic.js';
import { FilterGroup } from '../FilterGroup/FilterGroup.js';
import { FilterJoinButton } from '../FilterJoinButton/FilterJoinButton.js';
import { FilterSep } from '../FilterSep/FilterSep.js';
import styles from './AdvancedFilterBuilder.module.css';

export interface AdvancedFilterBuilderProps {
  /** The filter tree: the root joins its rule cards, each card is a group of conditions. */
  root: Group;
  parameters: ParameterDef[];
  /** Groups the "+ Filter" menu offers (Common, User, Computer, Groups). */
  categories: ParamCategory[];
  actions: FilterModelActions;
  /** Label of the empty state's add button. The Iris UI Kit says "Filter", the ARS Advanced Search examples "Add filter". */
  addLabel?: string;
  className?: string;
}

const ROOT_OPTIONS = [
  { op: 'and', label: 'Match all of the following' },
  { op: 'or', label: 'Match any of the following' },
] as const;

/**
 * AdvancedFilterBuilder — the Advanced filter "Panel" body: an empty state with "+ Filter", then rule
 * cards joined by AND/OR. Figma: Iris UI Kit "Advanced Filter Panel" 9956:7605.
 */
export function AdvancedFilterBuilder({ root, parameters, categories, actions, addLabel = 'Filter', className }: AdvancedFilterBuilderProps) {
  const rootOp = root.op === 'and' ? 'AND' : 'OR';

  // A new card starts with one condition, as in the Figma.
  const addCard = (parameterId?: string) => actions.addGroup(root.id, 'and', [newCondition({ parameterId })]);

  const addMenu = addFilterMenu(parameters, categories, (parameterId) => addCard(parameterId), () => addCard());

  if (root.children.length === 0) {
    return (
      <div className={cx(styles.root, styles.empty, className)}>
        <div className={styles.emptyContent}>
          <EmptyFilterGraphic />
          <Menu
            ariaLabel="Add filter"
            align="start"
            items={addMenu}
            trigger={({ ref, onClick, expanded }) => (
              <Button
                ref={ref as Ref<HTMLButtonElement>}
                variant="secondary"
                iconLead="Plus"
                aria-haspopup="menu"
                aria-expanded={expanded}
                onClick={onClick}
              >
                {addLabel}
              </Button>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.root, className)}>
      <Menu
        ariaLabel="Match"
        align="start"
        items={ROOT_OPTIONS.map((o) => ({
          kind: 'item',
          label: o.label,
          selected: o.op === root.op,
          onSelect: () => actions.setOp(root.id, o.op),
        }))}
        trigger={({ ref, onClick, expanded }) => (
          <button
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            className={styles.title}
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          >
            Where {root.op === 'and' ? 'all' : 'any'} conditions are met
            <Icon name="CaretDown" size="16px" className={styles.caret} />
          </button>
        )}
      />
      <div className={styles.cards}>
        {root.children.map((card, i) =>
          card.kind === 'group' ? (
            <div key={card.id} className={styles.card}>
              {i > 0 && (
                <FilterSep op={rootOp} onToggle={() => actions.setOp(root.id, root.op === 'and' ? 'or' : 'and')} />
              )}
              <FilterGroup group={card} parameters={parameters} actions={actions} />
            </div>
          ) : null,
        )}
      </div>
      <FilterJoinButton op={rootOp} aria-label={`Add another filter group joined with ${rootOp}`} onClick={() => addCard()} />
    </div>
  );
}
