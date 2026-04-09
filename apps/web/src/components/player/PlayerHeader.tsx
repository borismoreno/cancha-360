import { memo } from 'react';

interface PlayerHeaderProps {
  name: string;
  position?: string;
  teamName?: string;
  category?: string;
  age?: number | null;
  totalEvaluations?: number;
  attendancePct?: number | null;
}

function AvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-14 md:h-14" fill="#425900">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default memo(function PlayerHeader({
  name,
  position,
  teamName,
  category,
  age,
  totalEvaluations,
  attendancePct,
}: PlayerHeaderProps) {
  const hasStats = age != null || totalEvaluations != null || attendancePct != null;

  return (
    <div className="flex flex-col items-center text-center mb-5">
      {/* Team badge chip — desktop shows it above avatar */}
      {teamName && (
        <span
          className="font-body font-semibold text-on-surface-variant uppercase mb-3 px-3 py-1 rounded-full"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            backgroundColor: '#262626',
          }}
        >
          {teamName}
        </span>
      )}

      {/* Avatar */}
      <div className="relative mb-4">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)',
            boxShadow: '0 0 32px rgba(188,245,33,0.25)',
          }}
        >
          <AvatarIcon />
        </div>
        {category && (
          <span
            className="absolute -top-1 -right-1 font-body font-bold text-on-primary rounded-full px-1.5 py-0.5"
            style={{
              background: '#bcf521',
              fontSize: '0.55rem',
              letterSpacing: '0.04em',
            }}
          >
            {category.toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <h1
        className="font-display font-bold text-white uppercase leading-none tracking-wide"
        style={{ fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}
      >
        {name}
      </h1>

      {/* Position */}
      {position && (
        <p
          className="font-body font-semibold text-primary uppercase mt-2"
          style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}
        >
          {position}
        </p>
      )}

      {/* Desktop player stat badges — age, evaluations, attendance */}
      {hasStats && (
        <div
          className="hidden md:flex items-center gap-5 mt-4 pt-4 w-full justify-center"
          style={{ borderTop: '1px solid #262626' }}
        >
          {age != null && (
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg leading-none">{age}</p>
              <p
                className="font-body uppercase text-on-surface-variant mt-0.5"
                style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
              >
                EDAD
              </p>
            </div>
          )}
          {totalEvaluations != null && (
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg leading-none">
                {totalEvaluations}
              </p>
              <p
                className="font-body uppercase text-on-surface-variant mt-0.5"
                style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
              >
                EVALS
              </p>
            </div>
          )}
          {attendancePct != null && (
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg leading-none">
                {attendancePct}%
              </p>
              <p
                className="font-body uppercase text-on-surface-variant mt-0.5"
                style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
              >
                ASIST.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
