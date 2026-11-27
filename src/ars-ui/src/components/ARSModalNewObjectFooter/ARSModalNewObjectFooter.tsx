import { cx } from '@iris/lib/cx.js';
import { Button } from '@iris/components/Button/Button.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import styles from './ARSModalNewObjectFooter.module.css';

export type ARSModalNewObjectFooterVariant = '1' | '1_complete' | '2';

const STEP_LABEL: Record<ARSModalNewObjectFooterVariant, string> = {
  '1': 'Step 1 of 2',
  '1_complete': 'Step 1 of 2',
  '2': 'Step 2 of 2',
};

const CTA_LABEL: Record<ARSModalNewObjectFooterVariant, string> = {
  '1': 'Save and continue →',
  '1_complete': 'Save and continue →',
  '2': 'Create object',
};

export interface ARSModalNewObjectFooterProps {
  /** Figma "Property 1": step 1 not yet complete, step 1 complete, step 2. */
  variant?: ARSModalNewObjectFooterVariant;
  /** Replaces the step count; `null` hides it (flows without steps). */
  stepLabel?: string | null;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onBack?: () => void;
  onCta?: () => void;
  /** A ghost "Discard" before the main action, at the designer's request (not in Figma); shown when set. */
  onDiscard?: () => void;
  className?: string;
}

/**
 * ARS_.Modal_New_Object_Footer — the new-object modal footer: back, step count
 * and the main action. Figma: 3321:20516.
 */
export function ARSModalNewObjectFooter({
  variant = '1',
  stepLabel,
  ctaLabel,
  ctaDisabled = false,
  onBack,
  onCta,
  onDiscard,
  className,
}: ARSModalNewObjectFooterProps) {
  const step = stepLabel === undefined ? STEP_LABEL[variant] : stepLabel;
  return (
    <footer className={cx(styles.root, className)}>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.actions}>
          <IconButton icon="ArrowLeft" ariaLabel="Back" variant="ghost" disabled={variant !== '2'} onClick={onBack} />
          {step && <span className={styles.step}>{step}</span>}
        </div>
        <div className={styles.end}>
          {onDiscard && (
            <Button variant="ghost" onClick={onDiscard}>
              Discard
            </Button>
          )}
          <Button disabled={variant === '1' || ctaDisabled} onClick={onCta}>
            {ctaLabel ?? CTA_LABEL[variant]}
          </Button>
        </div>
      </div>
    </footer>
  );
}
