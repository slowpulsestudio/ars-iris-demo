import { Fragment } from 'react';
import { Avatar } from '@iris/components/Avatar/Avatar.js';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { cx } from '@iris/lib/cx.js';
import styles from './ARSOverviewTemplate.module.css';

export type ARSOverviewTemplateVariant = 'User' | 'Group' | 'OU';

export interface ARSOverviewField {
  label: string;
  value: string;
  /** Makes the whole count tile a button that calls this (e.g. to open the tab that lists them); its number turns blue. */
  onClick?: () => void;
}
type Field = ARSOverviewField;

export interface ARSOverviewData {
  profile?: {
    name: string;
    email: string;
    badges: { label: string; tone: BadgeTone }[];
    /** A photo; without one the avatar shows initials, as Figma draws it. */
    avatarSrc?: string;
  };
  /** Each entry is one block between dividers; a block can hold fields side by side. */
  details?: Field[][];
  stats: Field[];
  /** OU only: the "Other objects" strip. */
  others?: Field[];
  /** Title of the strip; the OU file writes "Other Objects". */
  othersTitle?: string;
}

const OBJECT_ID: Field = { label: 'Object ID', value: 'b8a5d3e9-7f2c-4b1a-9e6d-3c8f20a1b4c7' };

const OVERVIEWS: Record<ARSOverviewTemplateVariant, ARSOverviewData> = {
  User: {
    profile: {
      name: 'Evelyn Park',
      email: 'evelyn.park@saasii.io',
      badges: [
        { label: 'Member', tone: 'neutral' },
        { label: 'Active', tone: 'success' },
      ],
    },
    details: [
      [{ label: 'User principal name', value: 'EvelynP' }],
      [OBJECT_ID],
      [
        { label: 'Created on', value: '12 Jan, 2024' },
        { label: 'Last sign-in', value: '12 Jan, 2024' },
      ],
    ],
    stats: [
      { label: 'Group memberships', value: '32' },
      { label: 'Applications', value: '32' },
      { label: 'Assigned roles', value: '3' },
      { label: 'Assigned licenses', value: '5' },
    ],
  },
  Group: {
    profile: {
      name: 'Security Users',
      email: 'security.users@saasii.io',
      badges: [{ label: 'Cloud', tone: 'neutral' }],
    },
    details: [
      [{ label: 'Membership type', value: 'Security Group' }],
      [OBJECT_ID],
      [{ label: 'Created on', value: 'Jan 12, 2024' }],
    ],
    stats: [
      { label: 'Total members', value: '47' },
      { label: 'Users', value: '32' },
      { label: 'Groups', value: '8' },
      { label: 'Other objects', value: '5' },
    ],
  },
  OU: {
    stats: [
      { label: 'Total objects', value: '47' },
      { label: 'Users', value: '324' },
      { label: 'Groups', value: '11' },
      { label: 'Organizational units', value: '4' },
    ],
    others: [
      { label: 'Shared folders', value: '0' },
      { label: 'Contacts', value: '0' },
      { label: 'Printers', value: '2' },
      { label: 'GMSAs', value: '0' },
    ],
  },
};

export interface ARSOverviewTemplateProps {
  /** Figma "Variant". */
  variant?: ARSOverviewTemplateVariant;
  /** Replaces the sample content of the variant. */
  data?: ARSOverviewData;
  className?: string;
}

/**
 * ARS_Overview_Template — the overview of a user, group or OU: a profile
 * summary with key details, then count tiles ("Dashboard Widgets" frames in
 * the ARS file). Figma: 3353:38318.
 */
export function ARSOverviewTemplate({ variant = 'User', data, className }: ARSOverviewTemplateProps) {
  const { profile, details, stats, others, othersTitle = 'Other objects' } = data ?? OVERVIEWS[variant];

  return (
    <div className={cx(styles.root, className)}>
      {profile && details && (
        <>
          <div className={styles.hero}>
            <div className={styles.profile}>
              <Avatar name={profile.name} src={profile.avatarSrc} size="l" />
              <p className={styles.name}>{profile.name}</p>
              <p className={styles.email}>{profile.email}</p>
              <div className={styles.badges}>
                {profile.badges.map((b) => (
                  <Badge key={b.label} tone={b.tone}>
                    {b.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className={styles.details}>
              {details.map((block, i) => (
                <Fragment key={block[0].label}>
                  {i > 0 && <hr className={styles.divider} />}
                  <div className={styles.block}>
                    {block.map((f) => (
                      <div key={f.label} className={cx(styles.field, block.length > 1 && styles.fixed)}>
                        <span className={styles.label}>{f.label}</span>
                        <span className={styles.value}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <hr className={styles.divider} />
        </>
      )}
      <div className={styles.stats}>
        {stats.map((s) => {
          const body = (
            <>
              <span className={styles.widgetLabel}>{s.label}</span>
              <span className={cx(styles.widgetValue, s.onClick && styles.widgetLink)}>{s.value}</span>
            </>
          );
          return s.onClick ? (
            <button
              key={s.label}
              type="button"
              className={cx(styles.widget, styles.widgetButton)}
              onClick={s.onClick}
              aria-label={`${s.value} ${s.label}, open the list`}
            >
              {body}
            </button>
          ) : (
            <div key={s.label} className={styles.widget}>
              {body}
            </div>
          );
        })}
      </div>
      {others && (
        <div className={styles.strip}>
          <span className={styles.stripTitle}>{othersTitle}</span>
          <span className={styles.others}>
            {others.map((o, i) => (
              <Fragment key={o.label}>
                {i > 0 && ' · '}
                {o.label} <span className={styles.count}>{o.value}</span>
              </Fragment>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
