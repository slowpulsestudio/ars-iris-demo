import { cx } from '@iris/lib/cx.js';
import { ARSGroupGeneralContent, type ARSGroupGeneralContentVariant } from '../ARSGroupGeneralContent/ARSGroupGeneralContent.js';
import { ARSPageActionPanel } from '../ARSPageActionPanel/ARSPageActionPanel.js';
import styles from './ARSPageContent.module.css';

export interface ARSPageContentProps {
  /** Which Group General content variant the card shows. */
  cardVariant?: ARSGroupGeneralContentVariant;
  onEdit?: () => void;
  onSave?: () => void;
  onAction?: (action: string) => void;
  className?: string;
}

/** ARS_Page_Content — the group Properties card beside the Object Management panel. Figma: 2944:30346. */
export function ARSPageContent({ cardVariant = 'Default', onEdit, onSave, onAction, className }: ARSPageContentProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSGroupGeneralContent variant={cardVariant} onEdit={onEdit} onSave={onSave} className={styles.card} />
      <ARSPageActionPanel onAction={onAction} />
    </div>
  );
}
