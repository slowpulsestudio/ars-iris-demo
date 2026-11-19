import styles from './HourglassIcon.module.css';

/**
 * The Iris Time/Hourglass icon (Figma 2880:24858) drawn as an SVG so it can move while a job runs: sand runs from
 * the top bulb to the bottom, then the glass turns over. Still when `running` is false or motion is reduced.
 */
export function HourglassIcon({ running, size = 20 }: { running: boolean; size?: number }) {
  return (
    <svg
      className={styles.glass}
      data-running={running ? 'true' : undefined}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {running && (
        <>
          <path className={styles.top} d="M7.6 7.4h8.8L12 10.9z" fill="currentColor" />
          <path className={styles.bottom} d="M6.9 20.25h10.2v-2.6L12 15.6l-5.1 2z" fill="currentColor" />
          <path className={styles.stream} d="M12 11.6v6.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </>
      )}
      <path
        d="M12 12 6.3 7.725a.75.75 0 0 1-.3-.6V3.75A.75.75 0 0 1 6.75 3h10.5a.75.75 0 0 1 .75.75v3.341a.75.75 0 0 1-.298.596zm0 0-5.7 4.275a.75.75 0 0 0-.3.6v3.375a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75v-3.341a.75.75 0 0 0-.298-.598z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
