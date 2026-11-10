import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '@iris/components/Button/Button.js';
import styles from './Motion.module.css';

/** Live value of a CSS custom property on the themed body. */
function useTokenValue(name: string): string {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.body).getPropertyValue(name).trim());
  }, [name]);
  return value;
}

function Token({ name }: { name: string }) {
  const value = useTokenValue(name);
  return (
    <span className={styles.token}>
      <code>{name}</code>
      {value && <span className={styles.tokenValue}>{value}</span>}
    </span>
  );
}

// CSS keyword curves as cubic-bezier control points.
const KEYWORDS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

function controlPoints(value: string): [number, number, number, number] | null {
  if (value in KEYWORDS) return KEYWORDS[value];
  const m = value.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return null;
  const n = m[1].split(',').map(Number);
  return n.length === 4 && n.every(Number.isFinite) ? [n[0], n[1], n[2], n[3]] : null;
}

function Curve({ value }: { value: string }) {
  const p = controlPoints(value);
  if (!p) return <span />;
  const [x1, y1, x2, y2] = p;
  return (
    <svg className={styles.curve} viewBox="0 0 1 1" aria-hidden="true">
      <path className={styles.curveAxis} d="M0 0 V1 H1" />
      <path className={styles.curveLine} d={`M0 1 C${x1} ${1 - y1} ${x2} ${1 - y2} 1 0`} />
    </svg>
  );
}

function Track({ end, duration, easing }: { end: boolean; duration: string; easing: string }) {
  const run = { '--run-duration': `var(${duration})`, '--run-easing': `var(${easing})` } as CSSProperties;
  return (
    <span className={styles.track} data-end={end} style={run}>
      <span className={styles.runner}>
        <span className={styles.dot} />
      </span>
    </span>
  );
}

function DurationRow({ name, end }: { name: string; end: boolean }) {
  return (
    <>
      <Token name={name} />
      <Track end={end} duration={name} easing="--oi-motion-ease-none" />
    </>
  );
}

function EasingRow({ name, end }: { name: string; end: boolean }) {
  const value = useTokenValue(name);
  return (
    <>
      <Token name={name} />
      <Curve value={value} />
      <Track end={end} duration="--oi-motion-duration-loop" easing={name} />
    </>
  );
}

function usePlay() {
  const [end, setEnd] = useState(false);
  const play = (
    <Button variant="secondary" iconLead="Play" onClick={() => setEnd((v) => !v)}>
      Play
    </Button>
  );
  return { end, play };
}

/** Each duration token moves a dot across the track at a constant speed. */
export function DurationTokens({ tokens }: { tokens: string[] }) {
  const { end, play } = usePlay();
  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        {play}
        <p className={styles.note}>
          Each dot moves on <code>--oi-motion-ease-none</code> so only the duration differs.
        </p>
      </div>
      <div className={styles.durationTable}>
        {tokens.map((t) => (
          <DurationRow key={t} name={t} end={end} />
        ))}
      </div>
    </div>
  );
}

/** Each easing token as a curve and as a dot moving over --oi-motion-duration-loop. */
export function EasingTokens({ groups }: { groups: { title: string; tokens: string[] }[] }) {
  const { end, play } = usePlay();
  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        {play}
        <p className={styles.note}>
          Each dot moves over <code>--oi-motion-duration-loop</code> so the curve is visible; components use the
          shorter durations.
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{g.title}</h3>
          <div className={styles.easingTable}>
            {g.tokens.map((t) => (
              <EasingRow key={t} name={t} end={end} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export interface MotionStep {
  /** e.g. "Enter", "Exit", "Reduced motion". */
  label: string;
  /** What moves. */
  what: string;
  duration?: string;
  easing?: string;
}

/** A pattern demo: the tokens it uses, its controls, then the live component. */
export function MotionPattern({ steps, actions, children }: { steps: MotionStep[]; actions?: ReactNode; children?: ReactNode }) {
  return (
    <div className={styles.page}>
      <dl className={styles.spec}>
        {steps.map((s) => (
          <div key={s.label} className={styles.specRow}>
            <dt>{s.label}</dt>
            <dd>
              {s.what}
              {s.duration && <Token name={s.duration} />}
              {s.easing && <Token name={s.easing} />}
            </dd>
          </div>
        ))}
      </dl>
      {actions && <div className={styles.bar}>{actions}</div>}
      {children}
    </div>
  );
}
