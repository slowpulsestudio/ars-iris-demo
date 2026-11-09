import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { ObjectIcon } from '../../parts/ObjectIcon/ObjectIcon.js';
import { Tag } from '../../parts/Tag/Tag.js';
import styles from './ARSHeader.module.css';

export type ARSHeaderVariant =
  | 'Variant1'
  | 'Customize top-right'
  | 'Customize next to object class'
  | 'User'
  | 'Back bar';

interface VariantLayout {
  icon: string;
  back: boolean;
  supporting: boolean;
  customize: boolean;
  itemNav: boolean;
}

/** What each Figma variant shows. */
const LAYOUT: Record<ARSHeaderVariant, VariantLayout> = {
  Variant1: { icon: 'Folder', back: false, supporting: false, customize: false, itemNav: false },
  'Customize top-right': { icon: 'FolderStar', back: true, supporting: true, customize: false, itemNav: true },
  'Customize next to object class': { icon: 'FolderStar', back: true, supporting: true, customize: true, itemNav: false },
  User: { icon: 'User', back: true, supporting: true, customize: true, itemNav: true },
  'Back bar': { icon: 'User', back: false, supporting: true, customize: true, itemNav: true },
};

export interface ARSHeaderProps {
  /** Figma "Variant". */
  variant?: ARSHeaderVariant;
  title: string;
  /** Overrides the variant's object icon. */
  icon?: string;
  /** Supporting text, e.g. "Organizational unit". */
  objectClass?: string;
  /** Supporting text after the dot, e.g. "AD 1". */
  objectName?: string;
  /** Back bar: the tag on the right, e.g. "Management". */
  tag?: string;
  onBack?: () => void;
  onCustomize?: () => void;
  onMore?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
  className?: string;
}

/** ARS_Header — the object header above a list or detail view. Figma: 3368:19597. */
export function ARSHeader({
  variant = 'Variant1',
  title,
  icon,
  objectClass,
  objectName,
  tag,
  onBack,
  onCustomize,
  onMore,
  onNextItem,
  onPreviousItem,
  className,
}: ARSHeaderProps) {
  const layout = LAYOUT[variant];
  const back = <IconButton icon="ArrowLeft" ariaLabel="Back" onClick={onBack} />;

  const titleBar = (
    <div className={styles.titleBar}>
      <div className={cx(styles.lhs, variant === 'Variant1' && styles.lhsWide)}>
        {layout.back && back}
        <ObjectIcon icon={icon ?? layout.icon} />
        <div className={styles.titles}>
          <h2 className={styles.title}>{title}</h2>
          {layout.supporting && (
            <div className={styles.supportingRow}>
              <p className={styles.supporting}>
                {objectClass}
                <span className={styles.dot}> · </span>
                {objectName}
              </p>
              {layout.customize && (
                <IconButton icon="Gear" ariaLabel="Customize" onClick={onCustomize} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.rhs}>
        <IconButton icon="DotsThree" ariaLabel="More actions" onClick={onMore} />
        {layout.itemNav && (
          <div className={styles.itemNav}>
            <IconButton icon="CaretDown" ariaLabel="Next item" onClick={onNextItem} />
            <IconButton icon="CaretUp" ariaLabel="Previous item" onClick={onPreviousItem} />
          </div>
        )}
      </div>
    </div>
  );

  if (variant !== 'Back bar') return <div className={cx(styles.root, className)}>{titleBar}</div>;

  return (
    <div className={cx(styles.root, styles.stacked, className)}>
      <div className={styles.navBar}>
        {back}
        {tag && <Tag icon="FolderStar" label={tag} />}
      </div>
      {titleBar}
    </div>
  );
}
