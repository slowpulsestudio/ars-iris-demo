import type { ReactNode } from 'react';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo.js';
import { Icon } from '../../components/Icon/Icon.js';
import { useFixedTheme } from '../../lib/useTheme.js';
import styles from './ChoicePage.module.css';

interface ChoicePageProps {
  title: string;
  subtitle: string;
  /** Controls pinned to the page's top-left and top-right corners. */
  topStart?: ReactNode;
  topEnd?: ReactNode;
  /** `ChoiceCard`s. */
  children: ReactNode;
}

/**
 * ChoicePage — full-window page (no shell chrome) with the product lockup,
 * a heading and a row of big choice cards. Used by the welcome page and the
 * Storybooks page, which always show in the dark theme.
 */
export function ChoicePage({ title, subtitle, topStart, topEnd, children }: ChoicePageProps) {
  useFixedTheme('dark');
  return (
    <div className={styles.page}>
      {topStart && <div className={styles.topStart}>{topStart}</div>}
      {topEnd && <div className={styles.topEnd}>{topEnd}</div>}
      <main className={styles.content}>
        <header className={styles.intro}>
          <span className={styles.product}>
            <BrandLogo size="32px" />
            Active Roles
          </span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <ul className={styles.cards} role="list">
          {children}
        </ul>
      </main>
    </div>
  );
}

interface ChoiceCardProps {
  visual: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  onClick?: () => void;
  /** Opens this address in a new browser tab instead of calling `onClick`. */
  href?: string;
}

export function ChoiceCard({ visual, title, subtitle, description, cta, onClick, href }: ChoiceCardProps) {
  const body = (
    <>
      {visual}
      <span className={styles.who}>
        <span className={styles.name}>{title}</span>
        <span className={styles.cardSubtitle}>{subtitle}</span>
      </span>
      <span className={styles.description}>{description}</span>
      <span className={styles.cta}>
        {cta}
        <Icon name={href ? 'ArrowSquareOut' : 'ArrowRight'} size="16px" className={styles.arrow} />
        {href && <span className={styles.srOnly}> (opens in a new tab)</span>}
      </span>
    </>
  );

  return (
    <li className={styles.cardItem}>
      {href ? (
        <a className={styles.card} href={href} target="_blank" rel="noopener noreferrer">
          {body}
        </a>
      ) : (
        <button type="button" className={styles.card} onClick={onClick}>
          {body}
        </button>
      )}
    </li>
  );
}
