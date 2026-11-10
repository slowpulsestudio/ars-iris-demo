import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { ObjectIcon } from '../ObjectIcon/ObjectIcon.js';
import { ObjectTitle } from '../ObjectTitle/ObjectTitle.js';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  icon: string;
  objectClass: string;
  objectName: string;
  /** Adds the "..." button after the item arrows. */
  more?: boolean;
  onBack?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  onMore?: () => void;
  className?: string;
}

/** The header on an object's page: back, icon, title, and next/previous item arrows. */
export function PageHeader({
  title,
  icon,
  objectClass,
  objectName,
  more = false,
  onBack,
  onNextItem,
  onPreviousItem,
  onMore,
  className,
}: PageHeaderProps) {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.lhs}>
        <IconButton icon="ArrowLeft" ariaLabel="Back" onClick={onBack} />
        <ObjectIcon icon={icon} />
        <ObjectTitle title={title} objectClass={objectClass} objectName={objectName} />
      </div>
      <div className={styles.itemNav}>
        <IconButton icon="CaretDown" ariaLabel="Next item" onClick={onNextItem} />
        <IconButton icon="CaretUp" ariaLabel="Previous item" onClick={onPreviousItem} />
        {more && <IconButton icon="DotsThree" ariaLabel="More actions" onClick={onMore} />}
      </div>
    </div>
  );
}
