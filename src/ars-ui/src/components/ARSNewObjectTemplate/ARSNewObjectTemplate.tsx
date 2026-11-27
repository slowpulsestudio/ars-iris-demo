import type { ReactNode } from 'react';
import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import type { StepperStepItem } from '@iris/components/Stepper/Stepper.js';
import {
  ARSModalNewObjectFooter,
  type ARSModalNewObjectFooterVariant,
} from '../ARSModalNewObjectFooter/ARSModalNewObjectFooter.js';
import { ARSNewObjectContent } from '../ARSNewObjectContent/ARSNewObjectContent.js';
import { ARSNewObjectContentContainer } from '../ARSNewObjectContentContainer/ARSNewObjectContentContainer.js';
import styles from './ARSNewObjectTemplate.module.css';

export interface ARSNewObjectTemplateProps {
  title?: string;
  /** Supporting text under the title: where the object is created. Empty for Entra objects, which have no location. */
  location?: string;
  /** Header icon for the object type. */
  icon?: string;
  /** Figma annotation: the step count hides when the create action has no steps; the stepper hides too, as in ARS_New_Organizational_Unit. */
  hasSteps?: boolean;
  steps?: StepperStepItem[];
  activeIndex?: number;
  /** Makes reachable steps clickable. */
  interactiveSteps?: boolean;
  onStepSelect?: (index: number) => void;
  /** Footer variant; follows the step by default. */
  footerVariant?: ARSModalNewObjectFooterVariant;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  /** Sizes the body to each step's content instead of Figma's fixed height. */
  fitContent?: boolean;
  /** Replaces the form, as Figma's content slot does. */
  children?: ReactNode;
  /** Every step's content in step order, in place of `children`: the body keeps the tallest step's height (decided UI rule MOD-1). */
  stepContents?: ReactNode[];
  onClose?: () => void;
  onBack?: () => void;
  onContinue?: () => void;
  /** Shows a ghost Discard before the footer's main action (not in Figma). */
  onDiscard?: () => void;
  className?: string;
}

/**
 * ARS_New_Object_Template — the new-object modal: header, stepper and form,
 * and the step footer. Figma: 3367:12947.
 */
export function ARSNewObjectTemplate({
  title = 'New [Object Type]',
  location = '[Object Location]',
  icon = 'User',
  hasSteps = true,
  steps,
  activeIndex = 0,
  interactiveSteps,
  onStepSelect,
  footerVariant = '1',
  ctaLabel,
  ctaDisabled,
  fitContent = false,
  children,
  stepContents,
  onClose,
  onBack,
  onContinue,
  onDiscard,
  className,
}: ARSNewObjectTemplateProps) {
  return (
    <section className={cx(styles.root, className)} aria-label={title}>
      <header className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <Icon name={icon} size="24px" />
        </span>
        <div className={styles.heading}>
          <h2 className={styles.title}>{title}</h2>
          {location && <p className={styles.location}>{location}</p>}
        </div>
        <IconButton icon="X" ariaLabel="Close" variant="ghost" size="s" className={styles.close} onClick={onClose} />
      </header>
      <div className={styles.body}>
        <ARSNewObjectContentContainer
          steps={steps}
          showStepper={hasSteps}
          activeIndex={activeIndex}
          interactive={interactiveSteps}
          onStepSelect={onStepSelect}
          fitContent={fitContent}
          stepContents={stepContents}
        >
          {children ?? <ARSNewObjectContent showFolderButton />}
        </ARSNewObjectContentContainer>
      </div>
      <ARSModalNewObjectFooter
        variant={footerVariant}
        // Figma's footer counts two steps; a flow with its own steps counts those.
        stepLabel={!hasSteps ? null : steps ? `Step ${activeIndex + 1} of ${steps.length}` : undefined}
        ctaLabel={ctaLabel}
        ctaDisabled={ctaDisabled}
        onBack={onBack}
        onCta={onContinue}
        onDiscard={onDiscard}
      />
    </section>
  );
}
