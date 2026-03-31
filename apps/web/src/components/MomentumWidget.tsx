import { strings } from "../lib/strings";

interface MomentumWidgetProps {
  evaluatedCount: number;
  total: number;
}

export function MomentumWidget({ evaluatedCount, total }: MomentumWidgetProps) {
  const filled = Math.min(evaluatedCount, 4);
  const pct = total > 0 ? Math.round((evaluatedCount / total) * 100) : 0;

  return (
    <div className="relative bg-surface-high rounded-3xl p-4 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #bcf521 0%, #00f4fe 100%)" }}
      />
      <div className="flex items-start justify-between mb-4">
        <p
          className="font-body uppercase text-on-surface-variant"
          style={{ fontSize: "0.6875rem", letterSpacing: "0.05em" }}
        >
          {strings.dashboard.momentum.label}
        </p>
        <div className="flex gap-1 mt-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i === 0 ? "#bcf521" : "#262626" }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: i < filled ? "#bcf521" : "#1a1a1a",
              opacity: i < filled ? 1 : 0.35,
            }}
          >
            {i < filled && (
              <svg viewBox="0 0 24 24" fill="#425900" className="w-6 h-6">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
        {strings.dashboard.momentum.description(pct)}
      </p>
    </div>
  );
}
