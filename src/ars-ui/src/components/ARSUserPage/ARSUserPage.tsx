import { cx } from '@iris/lib/cx.js';
import { ARSObjectContent } from '../ARSObjectContent/ARSObjectContent.js';
import { ARSUserPageHeader } from '../ARSUserPageHeader/ARSUserPageHeader.js';
import styles from './ARSUserPage.module.css';

export interface ARSUserPageProps {
  onBack?: () => void;
  onEdit?: () => void;
  onAction?: (label: string) => void;
  className?: string;
}

/** ARS_User_Page — a user's page: header, then tabs, cards and actions. Figma: 3129:8132. */
export function ARSUserPage({ onBack, onEdit, onAction, className }: ARSUserPageProps) {
  return (
    <div className={cx(styles.root, className)}>
      <ARSUserPageHeader onBack={onBack} />
      <ARSObjectContent variant="General" onEdit={onEdit} onAction={onAction} />
    </div>
  );
}
