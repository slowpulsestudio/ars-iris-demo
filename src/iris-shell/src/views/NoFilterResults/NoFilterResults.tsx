import { Sieve } from '@lucasmarkes/hairline/react';
import { EmptyState } from '@ars';

export interface NoFilterResultsProps {
  /** Empties the applied filter. */
  onClear: () => void;
}

/**
 * NoFilterResults — a list's empty state when the applied filter leaves nothing to show: the ARS empty state
 * with the Hairline Sieve (bare sieves), and Clear filter (as the filter area's Clear, 4145:13713).
 */
export function NoFilterResults({ onClear }: NoFilterResultsProps) {
  return (
    <EmptyState figure={Sieve} message="No objects match the filter." actionLabel="Clear filter" actionIcon="XCircle" onAction={onClear} />
  );
}
