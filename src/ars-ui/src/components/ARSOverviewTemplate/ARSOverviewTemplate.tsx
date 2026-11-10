import { Fragment } from 'react';
import { Avatar } from '@iris/components/Avatar/Avatar.js';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { cx } from '@iris/lib/cx.js';
import styles from './ARSOverviewTemplate.module.css';

export type ARSOverviewTemplateVariant = 'User' | 'Group' | 'OU';

interface Field {
  label: string;
  value: string;
}

interface Overview {
  profile?: { name: string; email: string; badges: { label: string; tone: BadgeTone }[] };
  /** Each entry is one block between dividers; a block can hold fields side by side. */
  details?: Field[][];
  stats: Field[];
  /** OU only: the "Other objects" strip. */
  others?: Field[];
}

const OBJECT_ID: Field = { label: 'Object ID', value: 'b8a5d3e9-7f2c-4b1a-9e6d-3c8f20a1b4c7' };

const OVERVIEWS: Record<ARSOverviewTemplateVariant, Overview> = {
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
  className?: string;
}

/**
 * ARS_Overview_Template — the overview of a user, group or OU: a profile
 * summary with key details, then count tiles ("Dashboard Widgets" frames in
 * the ARS file). Figma: 3353:38318.
 */
export function ARSOverviewTemplate({ variant = 'User', className }: ARSOverviewTemplateProps) {
  const { profile, details, stats, others } = OVERVIEWS[variant];

  return (
    <div className={cx(styles.root, className)}>
      {profile && details && (
        <>
          <div className={styles.hero}>
            <div className={styles.profile}>
              <Avatar name={profile.name} size="l" />
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
        {stats.map((s) => (
          <div key={s.label} className={styles.widget}>
            <span className={styles.widgetLabel}>{s.label}</span>
            <span className={styles.widgetValue}>{s.value}</span>
          </div>
        ))}
      </div>
      {others && (
        <div className={styles.strip}>
          <span className={styles.stripTitle}>Other objects</span>
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
