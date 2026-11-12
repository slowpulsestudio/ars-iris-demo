import { ARSFilterTag } from '@ars';
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
 * Draws an Advanced filter Bar pill as the ARS filter tag, as the Favourites screens do
 * (Figma: ARS_Filter_Tag 2099:18646 in ARS - Favorites 4145:13715).
 */
export const renderArsFilterTag = (pill: AdvancedFilterBarPill) => (
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
