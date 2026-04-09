import { memo } from 'react';

interface EvaluationItemProps {
  label: string;
  delta: number;
  date: string;
  icon: React.ReactNode;
}

export default memo(function EvaluationItem({ label, delta, date, icon }: EvaluationItemProps) {
  const positive = delta >= 0;

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Icon bubble */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)' }}
      >
        {icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-white text-sm">{label}</p>
      </div>

      {/* Delta + date */}
      <div className="text-right shrink-0">
        <p
          className="font-body font-bold text-sm leading-tight"
          style={{ color: positive ? '#bcf521' : '#b92902' }}
        >
          {positive && delta !== 0 ? '+' : ''}
          {delta !== 0 ? delta.toFixed(1) : '—'}
        </p>
        <p className="font-body text-xs text-on-surface-variant">{date}</p>
      </div>
    </div>
  );
});
