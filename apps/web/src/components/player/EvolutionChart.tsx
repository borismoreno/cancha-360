import { memo, useMemo } from 'react';
import type { Evaluation } from '../../types/player';

interface EvolutionChartProps {
  evaluations: Evaluation[];
}

function evalOverall(ev: Evaluation): number {
  return Math.round(
    ((ev.technicalScore + ev.tacticalScore + ev.physicalScore + ev.attitudeScore) / 4) * 10,
  );
}

const BAR_W = 28;
const GAP = 12;
const CHART_H = 72;
const LABEL_H = 18;
const PAD_X = 6;
const PAD_TOP = 6;

export default memo(function EvolutionChart({ evaluations }: EvolutionChartProps) {
  const sorted = useMemo(
    () =>
      [...evaluations]
        .sort(
          (a, b) =>
            new Date(a.date ?? a.createdAt).getTime() -
            new Date(b.date ?? b.createdAt).getTime(),
        )
        .slice(-6),
    [evaluations],
  );

  if (sorted.length === 0) return null;

  const scores = sorted.map(evalOverall);
  const maxScore = Math.max(...scores, 1);

  const totalW = sorted.length * (BAR_W + GAP) - GAP + PAD_X * 2;
  const totalH = CHART_H + LABEL_H + PAD_TOP;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full"
      style={{ maxHeight: 110 }}
    >
      <defs>
        <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bcf521" />
          <stop offset="100%" stopColor="#bcf521" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="barGradSecondary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f4fe" />
          <stop offset="100%" stopColor="#00f4fe" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {sorted.map((ev, i) => {
        const score = scores[i];
        const barH = Math.max((score / maxScore) * CHART_H, 4);
        const x = PAD_X + i * (BAR_W + GAP);
        const y = PAD_TOP + CHART_H - barH;
        const isLast = i === sorted.length - 1;

        const date = new Date(ev.date ?? ev.createdAt);
        const label = date
          .toLocaleDateString('es-ES', { month: 'short' })
          .toUpperCase()
          .replace('.', '');

        return (
          <g key={ev.id ?? i}>
            <rect
              x={x}
              y={y}
              width={BAR_W}
              height={barH}
              rx="5"
              fill={isLast ? 'url(#barGradPrimary)' : 'url(#barGradSecondary)'}
              fillOpacity={isLast ? '1' : '0.55'}
            />
            <text
              x={x + BAR_W / 2}
              y={PAD_TOP + CHART_H + LABEL_H - 2}
              textAnchor="middle"
              fill="#adaaaa"
              fontSize="8"
              fontFamily="Inter, sans-serif"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
