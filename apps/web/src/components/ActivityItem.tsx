type SignalColor = "green" | "red" | "blue" | "gray";

export interface ActivitySignal {
  description: string;
  badge?: string;
  color: SignalColor;
}

interface ActivityItemProps {
  name: string;
  position?: string;
  signal: ActivitySignal;
  onClick: () => void;
}

const AVATAR_BG: Record<SignalColor, string> = {
  green: "#1a3a1a",
  red: "#3a1a1a",
  blue: "#00696e",
  gray: "#262626",
};

const BADGE_BG: Record<"green" | "red", string> = {
  green: "bg-primary text-on-primary",
  red: "bg-error-container text-white",
};

function PersonIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" stroke="currentColor">
      <path d="M1 9L4 5.5L6.5 7.5L10 2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
      <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AVATAR_ICON_COLOR: Record<SignalColor, string> = {
  green: "#bcf521",
  red: "#ffaaaa",
  blue: "#00f4fe",
  gray: "#adaaaa",
};

export function ActivityItem({ name, position, signal, onClick }: ActivityItemProps) {
  const hasBadge = !!signal.badge && (signal.color === "green" || signal.color === "red");

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-high rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-surface-highest transition-colors"
    >
      {/* Avatar circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: AVATAR_BG[signal.color] }}
      >
        <PersonIcon color={AVATAR_ICON_COLOR[signal.color]} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 text-left">
        <p className="font-display text-sm font-semibold text-white truncate">
          {name}
          {position && (
            <span className="font-body font-normal text-on-surface-variant ml-1">
              {position}
            </span>
          )}
        </p>
        <p className="font-body text-xs text-on-surface-variant mt-0.5 truncate">
          {signal.description}
        </p>
      </div>

      {/* Badge or chevron */}
      {hasBadge ? (
        <span
          className={`flex items-center gap-1 font-body text-xs font-bold px-2.5 py-1.5 rounded-full shrink-0 ${
            BADGE_BG[signal.color as "green" | "red"]
          }`}
        >
          <TrendUpIcon />
          {signal.badge}
        </span>
      ) : (
        <span className="text-on-surface-variant shrink-0">
          <ChevronRight />
        </span>
      )}
    </button>
  );
}
