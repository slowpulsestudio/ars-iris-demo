import { Lockers } from '@lucasmarkes/hairline/react';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';

/** NoDirectoriesSelected — a list's empty state while the directory picker has nothing ticked ("No directories"). */
export function NoDirectoriesSelected() {
  return (
    <EmptyFigure
      figure={Lockers}
      title="No directories selected."
      description="Select a directory in the directory picker to display its contents here."
    />
  );
}
