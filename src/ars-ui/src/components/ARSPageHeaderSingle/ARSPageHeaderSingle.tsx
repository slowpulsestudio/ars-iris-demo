import { PageHeader } from '../../parts/PageHeader/PageHeader.js';

export interface ARSPageHeaderSingleProps {
  title?: string;
  objectClass?: string;
  objectName?: string;
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  onMore?: () => void;
  className?: string;
}

/** ARS_Page_Header (single) — the group page header, with the "..." button. Figma: 2944:30067. */
export function ARSPageHeaderSingle({
  title = 'Security Users',
  objectClass = 'Security Group',
  objectName = 'AD1\\Groups',
  ...props
}: ARSPageHeaderSingleProps) {
  return <PageHeader {...props} title={title} icon="UsersThree" objectClass={objectClass} objectName={objectName} more />;
}
