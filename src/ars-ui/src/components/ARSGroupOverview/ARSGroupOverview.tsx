import { Avatar } from '@iris/components/Avatar/Avatar.js';
import { Badge, type BadgeTone } from '@iris/components/Badge/Badge.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Tooltip } from '@iris/components/Tooltip/Tooltip.js';
import { cx } from '@iris/lib/cx.js';
import styles from './ARSGroupOverview.module.css';

export interface ARSGroupOverviewCounts {
  total: number;
  users: number;
  groups: number;
  devices: number;
  others: number;
  owners: number;
}

export interface ARSGroupOverviewProps {
  name: string;
  /** e.g. Security Group. */
  membershipType: string;
  /** e.g. Cloud. */
  source: string;
  objectId: string;
  createdOn: string;
  email: string;
  /** Extra status badges after the source, e.g. Deprovisioned. */
  badges?: { label: string; tone: BadgeTone }[];
  counts: ARSGroupOverviewCounts;
  onCopyName?: () => void;
  /** Makes the counts links, e.g. to the Memberships tab. */
  onOpenMembers?: () => void;
  className?: string;
}

const COUNT_ROWS: { key: keyof ARSGroupOverviewCounts; label: string }[] = [
  { key: 'total', label: 'Total members' },
  { key: 'users', label: 'User(s)' },
  { key: 'groups', label: 'Group(s)' },
  { key: 'devices', label: 'Device(s)' },
  { key: 'others', label: 'Other(s)' },
  { key: 'owners', label: 'Owner(s)' },
];

/**
 * ARS_Group_Overview — a group's Overview tab: Basic information and member
 * counts as labelled rows. Figma: ARS_WebUI2_Groups 158:33654.
 */
export function ARSGroupOverview({
  name,
  membershipType,
  source,
  objectId,
  createdOn,
  email,
  badges = [],
  counts,
  onCopyName,
  onOpenMembers,
  className,
}: ARSGroupOverviewProps) {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Overview</h2>
        <p className={styles.subtitle}>View summary information and member counts for this group.</p>
      </div>

      <section className={styles.card} aria-labelledby="group-overview-basic">
        <h3 id="group-overview-basic" className={styles.cardTitle}>
          Basic information
        </h3>
        <dl className={styles.rows}>
          <dt>Object Avatar</dt>
          <dd>
            <Avatar name={name} size="default" className={styles.avatar} />
          </dd>
          <dt>Object name</dt>
          <dd className={styles.nameRow}>
            {name}
            <Tooltip label="Copy name">
              <IconButton icon="Copy" size="s" ariaLabel="Copy name" onClick={onCopyName} />
            </Tooltip>
          </dd>
          <dt>Membership type</dt>
          <dd>{membershipType}</dd>
          <dt>Source</dt>
          <dd className={styles.inline}>
            <Badge tone="neutral">{source}</Badge>
            {badges.map((b) => (
              <Badge key={b.label} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </dd>
          <dt>Object ID</dt>
          <dd>{objectId}</dd>
          <dt>Created on</dt>
          <dd>{createdOn}</dd>
          <dt>Email</dt>
          <dd>{email}</dd>
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="group-overview-members">
        <h3 id="group-overview-members" className={styles.cardTitle}>
          Members
        </h3>
        <dl className={styles.rows}>
          {COUNT_ROWS.map((row) => (
            <div key={row.key} className={styles.pair}>
              <dt>{row.label}</dt>
              <dd>
                {onOpenMembers ? (
                  <button
                    type="button"
                    className={styles.count}
                    aria-label={`${row.label}: ${counts[row.key]}`}
                    onClick={onOpenMembers}
                  >
                    {counts[row.key]}
                  </button>
                ) : (
                  <span className={styles.count}>{counts[row.key]}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
