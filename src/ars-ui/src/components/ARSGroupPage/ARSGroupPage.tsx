import { cx } from '@iris/lib/cx.js';
import { ARSPageContent } from '../ARSPageContent/ARSPageContent.js';
import { ARSPageHeaderSingle } from '../ARSPageHeaderSingle/ARSPageHeaderSingle.js';
import { ARSPageTabs } from '../ARSPageTabs/ARSPageTabs.js';
import styles from './ARSGroupPage.module.css';

export interface ARSGroupPageProps {
  onBack?: () => void;
  onEdit?: () => void;
  onAction?: (action: string) => void;
  className?: string;
}

/** ARS_Group_Page — a group's page: header, tabs, Properties card and actions. Figma: 2944:29514. */
export function ARSGroupPage({ onBack, onEdit, onAction, className }: ARSGroupPageProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSPageHeaderSingle onBack={onBack} />
      <ARSPageTabs />
      <ARSPageContent onEdit={onEdit} onAction={onAction} />
    </div>
  );
}
