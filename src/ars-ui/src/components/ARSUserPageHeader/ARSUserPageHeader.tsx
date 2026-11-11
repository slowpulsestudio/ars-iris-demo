import type { MouseEventHandler } from 'react';
import { PageHeader } from '../../parts/PageHeader/PageHeader.js';

export interface ARSUserPageHeaderProps {
  title?: string;
  /** Header icon; a user by default. */
  icon?: string;
  objectClass?: string;
  objectName?: string;
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  onMore?: MouseEventHandler<HTMLElement>;
  className?: string;
}

/** ARS_User_Page_Header — the header on a user's page, with the "..." button. Figma: 3598:47947. */
export function ARSUserPageHeader({
  title = 'MKim',
  icon = 'User',
  objectClass = 'User',
  objectName = 'Entra1',
  ...props
}: ARSUserPageHeaderProps) {
  return <PageHeader {...props} title={title} icon={icon} objectClass={objectClass} objectName={objectName} more />;
}
