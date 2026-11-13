import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import styles from './FilterPill.module.css';

export type FilterPillSegment = 'parameter' | 'operator' | 'value' | 'more';

export interface FilterPillProps {
  /** Left segment: the field being filtered. */
  parameter: { label: string; icon?: string };
  operator?: { label: string; icon?: string };
  value?: string;
  /** Collapses the remaining conditions into "and 3 more conditions". */
  more?: { connector: 'and' | 'or'; count: number };
  /** The pill before any condition exists: grey, "Advanced filter" with the funnel. */
  empty?: boolean;
  /** Called when a segment is pressed. Without it the segments are not interactive. */
  onEdit?: (segment: FilterPillSegment) => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/**
 * FilterPill — the Advanced filter "Bar" pill: parameter, operator, value, optional
 * "and N more conditions" and a remove. Figma: Iris UI Kit ".Advanced filter bar, pill" 10052:6218.
 */
export function FilterPill({
  parameter,
  operator,
  value,
  more,
  empty = false,
  onEdit,
  onRemove,
  removeLabel = `Remove ${parameter.label}`,
  className,
}: FilterPillProps) {
  const segment = (key: FilterPillSegment, extra: string | false, children: ReactNode) =>
    onEdit ? (
      <button type="button" className={cx(styles.seg, extra)} data-segment={key} onClick={() => onEdit(key)}>
        {children}
      </button>
    ) : (
      <span className={cx(styles.seg, extra)} data-segment={key}>
        {children}
      </span>
    );

  return (
    <span className={cx(styles.pill, className)}>
      {segment(
        'parameter',
        empty && styles.empty,
        <>
          {parameter.icon && <Icon name={parameter.icon} size="16px" className={styles.icon} />}
          <span className={styles.text}>{parameter.label}</span>
        </>,
      )}
      {operator && (
        <>
          <span className={styles.divider} aria-hidden="true" />
          {segment(
            'operator',
            styles.muted,
            <>
              {operator.icon && <Icon name={operator.icon} size="16px" className={styles.icon} />}
              <span className={styles.text}>{operator.label}</span>
            </>,
          )}
        </>
      )}
      {value !== undefined && (
        <>
          <span className={styles.divider} aria-hidden="true" />
          {segment('value', styles.value, <span className={styles.text}>{value}</span>)}
        </>
      )}
      {more && (
        <>
          <span className={styles.connector}>{more.connector}</span>
          {segment(
            'more',
            styles.more,
            <span className={styles.text}>
              {more.count} more {more.count === 1 ? 'condition' : 'conditions'}
            </span>,
          )}
        </>
      )}
      <span className={styles.divider} aria-hidden="true" />
      <button type="button" className={cx(styles.seg, styles.end)} onClick={onRemove} aria-label={removeLabel}>
        <Icon name="X" size="16px" className={styles.icon} />
      </button>
    </span>
  );
}
