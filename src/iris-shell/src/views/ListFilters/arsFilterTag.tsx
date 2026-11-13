import { ARSFilterSelect, ARSFilterTag, type ARSFilterSelectPart } from '@ars';
import type { AdvancedFilterBarPill } from '@iris-new';

/** Date values arrive as `2026-05-01`; Figma's pill writes them as `01/05/26`. */
const shortDate = (v: string) => v.replace(/^\d{2}(\d{2})-(\d{2})-(\d{2})$/, '$3/$2/$1');

/** The rule word in a filter tag: Figma writes "is" and "is between". */
function ruleWord(pill: AdvancedFilterBarPill): string {
  if (pill.operatorId === 'eq' || pill.operatorId === 'in') return 'is';
  if (pill.operatorId === 'neq' || pill.operatorId === 'nin') return 'is not';
  return pill.operator;
}

/**
 * Draws an Advanced filter Bar pill as the ARS filter, as the Favourites screens and the modals do: a date
 * condition as the date pill (filter-select 4145:59397: × Date active is between 📅 01/05/26 and 📅 28/05/26),
 * anything else as ARS_Filter_Tag (2099:18646). Figma: ARS - Favorites 4145:13715, Modal 4145:59111.
 */
export const renderArsFilterTag = (pill: AdvancedFilterBarPill) => {
  if (pill.date && pill.values.length > 0 && pill.extra === 0) {
    const parts: ARSFilterSelectPart[] = [
      { kind: 'field', label: pill.field },
      { kind: 'rule', label: ruleWord(pill) },
      ...pill.values.flatMap((v, i): ARSFilterSelectPart[] => [
        ...(i > 0 ? [{ kind: 'rule' as const, label: 'and', plain: true }] : []),
        { kind: 'object', label: shortDate(v), icon: 'CalendarBlank' },
      ]),
    ];
    return <ARSFilterSelect parts={parts} onEdit={() => pill.onEdit()} onRemove={pill.onRemove} removeLabel={`Remove ${pill.field} filter`} />;
  }
  return (
    <ARSFilterTag
      field={pill.field}
      rule={ruleWord(pill)}
      // "is between" shows its two ends as one value: "01/05/26 and 28/05/26".
      values={pill.operatorId === 'between' ? [pill.values.map(shortDate).join(' and ')] : pill.values.map(shortDate)}
      extra={pill.extra}
      onEdit={pill.onEdit}
      onRemove={pill.onRemove}
    />
  );
};
