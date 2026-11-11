import { useMemo } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { cx } from '../../lib/cx.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import styles from './LineChart.module.css';

export interface LineDatum {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineDatum[];
  /** Number of Y-axis ticks. */
  tickCount?: number;
  /** Appended to Y-axis tick labels and tooltips, e.g. "h". */
  unit?: string;
  height?: number;
  className?: string;
}

const VB_WIDTH = 400;
const PAD = { top: 8, right: 8, bottom: 28, left: 44 };

/**
 * LineChart — minimal SVG line chart, drawn like BarChart (same viewBox, gridlines and labels).
 */
export function LineChart({ data, tickCount = 4, unit = '', height = 200, className }: LineChartProps) {
  const { ticks, points, y } = useMemo(() => {
    const x = scalePoint<string>()
      .domain(data.map((d) => d.label))
      .range([PAD.left, VB_WIDTH - PAD.right])
      .padding(0.5);
    const values = data.map((d) => d.value);
    const lo = values.length ? Math.min(...values) : 0;
    const hi = values.length ? Math.max(...values) : 1;
    const yScale = scaleLinear()
      .domain(lo === hi ? [lo - 1, hi + 1] : [lo, hi])
      .nice(tickCount)
      .range([height - PAD.bottom, PAD.top]);
    return {
      y: yScale,
      ticks: yScale.ticks(tickCount),
      points: data.map((d) => ({ x: x(d.label) ?? 0, y: yScale(d.value), label: d.label, value: d.value })),
    };
  }, [data, tickCount, height]);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${VB_WIDTH} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Line chart"
      className={cx(styles.svg, className)}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={VB_WIDTH - PAD.right} y1={y(t)} y2={y(t)} className={styles.gridline} />
          <text x={PAD.left - 6} y={y(t) + 3} className={styles.tick} textAnchor="end">
            {`${t}${unit}`}
          </text>
        </g>
      ))}

      <path d={path} className={styles.line} />

      {/* Points are zero-length round-capped strokes, so they stay circular in the stretched viewBox. */}
      {points.map((p) => (
        <Tooltip key={p.label} label={`${p.label}: ${p.value}${unit}`}>
          <path d={`M${p.x},${p.y}h0`} tabIndex={0} className={styles.point} />
        </Tooltip>
      ))}

      {points.map((p) => (
        <text key={`l-${p.label}`} x={p.x} y={height - 10} textAnchor="middle" className={styles.axisLabel}>
          {p.label}
        </text>
      ))}
    </svg>
  );
}
