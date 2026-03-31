import { strings } from "../lib/strings";

interface MainCTAProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export function MainCTA({ title, subtitle, onClick }: MainCTAProps) {
  return (
    <div
      className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)" }}
    >
      {/* Decorative wave */}
      <div className="absolute right-0 top-0 bottom-0 w-40 md:w-56 pointer-events-none select-none">
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M10 140 Q50 80 90 110 Q130 140 170 60 Q185 35 200 45"
            stroke="#425900"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M10 160 Q60 110 100 130 Q140 150 180 90 Q190 75 200 80"
            stroke="#425900"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
          />
          {/* Sparkle dots */}
          <circle cx="155" cy="50" r="5" fill="#425900" opacity="0.4" />
          <circle cx="170" cy="30" r="3" fill="#425900" opacity="0.3" />
          <circle cx="185" cy="55" r="4" fill="#425900" opacity="0.35" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-[65%] md:max-w-[60%]">
        <h2
          className="font-display font-bold text-on-primary leading-tight"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
        >
          {title}
        </h2>
        <p className="font-body text-sm text-on-primary/80 mt-2 leading-relaxed">
          {subtitle}
        </p>
        <button
          onClick={onClick}
          className="mt-5 px-5 py-2.5 rounded-full font-display font-semibold text-sm text-primary hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#425900" }}
        >
          {strings.dashboard.cta.button}
        </button>
      </div>
    </div>
  );
}
