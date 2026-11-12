import { Vault } from '@lucasmarkes/hairline/react';
import { EmptyFigure } from '../../components/EmptyFigure/EmptyFigure.js';

export interface ComingSoonProps {
  /** Accessible name of the figure, e.g. the tab it stands in for. */
  label?: string;
}

/** ComingSoon — the one placeholder for anything that isn't built yet: the interactive vault figure with "Coming soon". */
export function ComingSoon({ label }: ComingSoonProps) {
  return <EmptyFigure figure={Vault} title="Coming soon" label={label} disabled />;
}
