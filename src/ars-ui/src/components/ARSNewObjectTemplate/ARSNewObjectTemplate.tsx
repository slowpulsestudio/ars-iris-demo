import { cx } from '@iris/lib/cx.js';
import { Icon } from '@iris/components/Icon/Icon.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { ARSModalNewObjectFooter } from '../ARSModalNewObjectFooter/ARSModalNewObjectFooter.js';
import { ARSNewObjectContent } from '../ARSNewObjectContent/ARSNewObjectContent.js';
import { ARSNewObjectContentContainer } from '../ARSNewObjectContentContainer/ARSNewObjectContentContainer.js';
import styles from './ARSNewObjectTemplate.module.css';

export interface ARSNewObjectTemplateProps {
  title?: string;
  /** Supporting text under the title: where the object is created. */
  location?: string;
  /** Header icon for the object type. */
  icon?: string;
  /** Figma annotation: the step count hides when the create action has no steps. */
  hasSteps?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onContinue?: () => void;
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
  onClose,
  onBack,
  onContinue,
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
          <p className={styles.location}>{location}</p>
        </div>
        <IconButton icon="X" ariaLabel="Close" variant="ghost" size="s" className={styles.close} onClick={onClose} />
      </header>
      <div className={styles.body}>
        <ARSNewObjectContentContainer>
          <ARSNewObjectContent showFolderButton />
        </ARSNewObjectContentContainer>
      </div>
      <ARSModalNewObjectFooter
        variant="1"
        stepLabel={hasSteps ? undefined : null}
        onBack={onBack}
        onCta={onContinue}
      />
    </section>
  );
}
