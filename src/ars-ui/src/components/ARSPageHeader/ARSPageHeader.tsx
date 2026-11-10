import { PageHeader } from '../../parts/PageHeader/PageHeader.js';

export type ARSPageHeaderVariant = 'User' | 'Device' | 'Variant3';

const CONTENT: Record<ARSPageHeaderVariant, { title: string; icon: string; objectClass: string }> = {
  User: { title: 'MKim', icon: 'User', objectClass: 'User' },
  Device: { title: 'Device01', icon: 'Desktop', objectClass: 'Asset' },
  Variant3: { title: 'Device01', icon: 'Desktop', objectClass: 'Asset' },
};

export interface ARSPageHeaderProps {
  /** Figma "Property 1". */
  variant?: ARSPageHeaderVariant;
  /** Overrides Figma's sample title, e.g. "MKim". */
  title?: string;
  objectName?: string;
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  className?: string;
}

/** ARS_Page_Header — back, object icon, title, and next/previous arrows. Figma: 3066:57118. */
export function ARSPageHeader({ variant = 'User', title, objectName = 'Entra1', ...props }: ARSPageHeaderProps) {
  const content = CONTENT[variant];
  return <PageHeader {...props} {...content} title={title ?? content.title} objectName={objectName} />;
}
