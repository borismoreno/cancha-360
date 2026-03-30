interface MetricCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, sub, icon }: MetricCardProps) {
  return (
    <div className="relative bg-surface-high rounded-3xl p-3 md:p-5 overflow-hidden flex flex-col gap-1 min-h-24 md:min-h-32">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #bcf521 0%, #00f4fe 100%)" }}
      />
      <div className="flex items-start justify-between gap-1">
        <p
          className="font-body uppercase text-on-surface-variant leading-tight"
          style={{ fontSize: "0.6875rem", letterSpacing: "0.05em" }}
        >
          {label}
        </p>
        {icon && <div className="text-on-surface-variant shrink-0">{icon}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <span
          className="font-display font-bold text-white leading-none"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)" }}
        >
          {value}
        </span>
        {sub && (
          <p className="font-body text-xs text-primary font-medium mt-1 hidden md:block">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
