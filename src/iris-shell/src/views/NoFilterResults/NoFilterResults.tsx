import { Loupe } from '@lucasmarkes/hairline/react';
import { Button } from '../../components/Button/Button.js';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';

export interface NoFilterResultsProps {
  /** Empties the applied filter. */
  onClear: () => void;
}

/** NoFilterResults — a list's empty state when the applied filter leaves nothing to show. Not drawn in Figma. */
export function NoFilterResults({ onClear }: NoFilterResultsProps) {
  return (
    <EmptyFigure
      figure={Loupe}
      title="No results match the filter."
      description="Change or clear the filter to see more."
      action={
        <Button variant="secondary" onClick={onClear}>
          Clear filter
        </Button>
      }
    />
  );
}
