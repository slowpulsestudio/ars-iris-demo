import { EmptyState } from '@ars';

export interface NoFilterResultsProps {
  /** Empties the applied filter. */
  onClear: () => void;
}

/**
 * NoFilterResults — a list's empty state when the applied filter leaves nothing to show: the ARS "No data"
 * empty state (Figma ARS_Empty_Content 3423:30769) with Clear filter (as the filter area's Clear, 4145:13713).
 */
export function NoFilterResults({ onClear }: NoFilterResultsProps) {
  return <EmptyState message="No objects match the filter." actionLabel="Clear filter" actionIcon="XCircle" onAction={onClear} />;
}
