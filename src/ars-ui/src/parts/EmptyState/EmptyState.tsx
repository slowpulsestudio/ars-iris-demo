import { Drawer } from '@lucasmarkes/hairline/react';
import { Button } from '@iris/components/Button/Button.js';
import { EmptyFigure, type EmptyFigureProps } from '@iris/components/EmptyFigure/EmptyFigure.js';

export interface EmptyStateProps {
  /** e.g. "This Organizational Unit has no objects." */
  message: string;
  /** Secondary Icon + Text button, e.g. "Add object". */
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  /** The Hairline figure; an empty filing cabinet (Drawer) unless the case has a closer one. */
  figure?: EmptyFigureProps['figure'];
  className?: string;
}

/**
 * The ARS empty state: the Iris empty state (EmptyFigure) with a Hairline figure, the message and a button,
 * centred in the space left. It replaces the older "No data" drawing of ARS_Empty_Content 3423:30769, as the
 * designer asked; see Design update recommendations.
 */
export function EmptyState({ message, actionLabel, actionIcon = 'Plus', onAction, figure = Drawer, className }: EmptyStateProps) {
  return (
    <EmptyFigure
      className={className}
      figure={figure}
      title={message}
      action={
        actionLabel ? (
          <Button variant="secondary" iconLead={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}
