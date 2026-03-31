import { strings } from "../lib/strings";

interface TeamCardProps {
  name: string;
  category: string;
  playerCount?: number;
  onClick: () => void;
}

export function TeamCard({ name, category, playerCount, onClick }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left rounded-3xl overflow-hidden hover:opacity-90 transition-opacity"
      style={{ minHeight: "130px" }}
    >
      {/* Dark photo-like background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0f2a18 0%, #1c3d28 40%, #0a1a10 100%)",
        }}
      />
      {/* Radial accent */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, #bcf521 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <p
            className="font-body uppercase text-primary"
            style={{ fontSize: "0.6875rem", letterSpacing: "0.05em" }}
          >
            {category}
          </p>
          <svg
            className="w-5 h-5 text-on-surface-variant"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <div>
          <p
            className="font-display font-bold text-white"
            style={{ fontSize: "1.75rem", lineHeight: 1 }}
          >
            {name}
          </p>
          {playerCount !== undefined && (
            <p className="font-body text-xs text-on-surface-variant mt-1">
              {strings.teams.playerCount(playerCount)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
