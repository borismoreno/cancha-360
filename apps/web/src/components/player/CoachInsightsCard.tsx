import { memo } from 'react';
import { strings } from '../../lib/strings';

interface CoachInsightsCardProps {
  text: string;
}

function InsightStarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#425900">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export default memo(function CoachInsightsCard({ text }: CoachInsightsCardProps) {
  return (
    <div
      className="rounded-3xl p-5 mt-4 relative overflow-hidden"
      style={{ backgroundColor: '#201f1f' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, #00f4fe, #bcf521)' }}
      />

      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #bcf521, #00f4fe)' }}
        >
          <InsightStarIcon />
        </div>
        <h3
          className="font-display font-semibold text-white uppercase tracking-widest"
          style={{ fontSize: '0.7rem' }}
        >
          {strings.players.detail.coachInsightsHeading}
        </h3>
        <span className="text-primary" style={{ fontSize: '0.8rem', lineHeight: 1 }}>
          ✦
        </span>
      </div>

      {/* Quote */}
      <blockquote className="font-body text-sm text-on-surface-variant leading-relaxed">
        "{text}"
      </blockquote>
    </div>
  );
});
