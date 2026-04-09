import { memo } from 'react';
import { strings } from '../../lib/strings';

interface StatusCardProps {
  overallScore: number;
  progressPct: number | null;
}

export default memo(function StatusCard({ overallScore, progressPct }: StatusCardProps) {
  const positive = progressPct === null || progressPct >= 0;

  return (
    <div
      className="rounded-3xl p-5 mb-4 relative overflow-hidden"
      style={{ backgroundColor: '#201f1f' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, #bcf521, #00f4fe)' }}
      />

      <div className="flex items-start justify-between gap-4">
        {/* Left: status text */}
        <div className="flex-1 min-w-0">
          <p
            className="font-body uppercase text-primary mb-1"
            style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
          >
            {strings.players.detail.statusLabel}
          </p>
          <h2
            className="font-display font-bold leading-tight"
            style={{ fontSize: '1.35rem' }}
          >
            <span className="text-primary">{strings.players.detail.statusMessage1}</span>
            <br />
            <span className="text-white">{strings.players.detail.statusMessage2}</span>
          </h2>
        </div>

        {/* Right: OVR score */}
        <div className="text-right shrink-0">
          <p
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: '3rem' }}
          >
            {overallScore}
          </p>
          <p
            className="font-body uppercase text-on-surface-variant"
            style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}
          >
            {strings.players.detail.ovrLabel}
          </p>
        </div>
      </div>

      {/* Progress bar + pct */}
      <div className="mt-4">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: '#262626' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(overallScore, 100)}%`,
              background: 'linear-gradient(90deg, #bcf521, #00f4fe)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        {progressPct !== null && (
          <p
            className="font-body text-xs mt-1.5"
            style={{ color: positive ? '#bcf521' : '#b92902' }}
          >
            {positive ? '+' : ''}
            {progressPct.toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
});
