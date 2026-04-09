import { memo, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import PlayerHeader from '../components/player/PlayerHeader';
import StatusCard from '../components/player/StatusCard';
import RadarChart from '../components/player/RadarChart';
import EvolutionChart from '../components/player/EvolutionChart';
import EvaluationItem from '../components/player/EvaluationItem';
import CoachInsightsCard from '../components/player/CoachInsightsCard';
import { playersApi } from '../api/players.api';
import { useAuth } from '../hooks/useAuth';
import { strings } from '../lib/strings';
import type { Evaluation } from '../types/player';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function evalAvg(ev: Evaluation): number {
  return (ev.technicalScore + ev.tacticalScore + ev.physicalScore + ev.attitudeScore) / 4;
}

function calcProgress(evaluations: Evaluation[]): number | null {
  if (evaluations.length < 2) return null;
  const sorted = [...evaluations].sort(
    (a, b) =>
      new Date(a.date ?? a.createdAt).getTime() - new Date(b.date ?? b.createdAt).getTime(),
  );
  const last = evalAvg(sorted[sorted.length - 1]);
  const prev = evalAvg(sorted[sorted.length - 2]);
  if (prev === 0) return null;
  return ((last - prev) / prev) * 100;
}

function buildEvalItems(evaluations: Evaluation[]) {
  if (evaluations.length === 0) return [];

  const sorted = [...evaluations].sort(
    (a, b) =>
      new Date(b.date ?? b.createdAt).getTime() - new Date(a.date ?? a.createdAt).getTime(),
  );

  const last = sorted[0];
  const prev = sorted[1];

  const formatDate = (d: string) =>
    new Date(d)
      .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
      .toUpperCase()
      .replace('.', '');

  const lastDate = formatDate(last.date ?? last.createdAt);

  return [
    {
      label: strings.players.detail.attrLabels[0],
      delta: Number((last.technicalScore - (prev?.technicalScore ?? last.technicalScore)).toFixed(1)),
      score: last.technicalScore,
      date: lastDate,
      iconIdx: 0,
    },
    {
      label: strings.players.detail.attrLabels[1],
      delta: Number((last.tacticalScore - (prev?.tacticalScore ?? last.tacticalScore)).toFixed(1)),
      score: last.tacticalScore,
      date: lastDate,
      iconIdx: 1,
    },
    {
      label: strings.players.detail.attrLabels[2],
      delta: Number((last.physicalScore - (prev?.physicalScore ?? last.physicalScore)).toFixed(1)),
      score: last.physicalScore,
      date: lastDate,
      iconIdx: 2,
    },
    {
      label: strings.players.detail.attrLabels[3],
      delta: Number((last.attitudeScore - (prev?.attitudeScore ?? last.attitudeScore)).toFixed(1)),
      score: last.attitudeScore,
      date: lastDate,
      iconIdx: 3,
    },
  ].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

function computeAge(birthdate?: string): number | null {
  if (!birthdate) return null;
  const ms = Date.now() - new Date(birthdate).getTime();
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

// ─── Attribute icons ──────────────────────────────────────────────────────────

const TechIcon = memo(function TechIcon({ sm }: { sm?: boolean }) {
  const cls = sm ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="#425900">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z" />
    </svg>
  );
});

const TacticIcon = memo(function TacticIcon({ sm }: { sm?: boolean }) {
  const cls = sm ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="#425900">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
});

const PhysicalIcon = memo(function PhysicalIcon({ sm }: { sm?: boolean }) {
  const cls = sm ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="#425900">
      <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
    </svg>
  );
});

const AttitudeIcon = memo(function AttitudeIcon({ sm }: { sm?: boolean }) {
  const cls = sm ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="#425900">
      <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
    </svg>
  );
});

const ATTR_ICONS_LG = [<TechIcon />, <TacticIcon />, <PhysicalIcon />, <AttitudeIcon />];
const ATTR_ICONS_SM = [<TechIcon sm />, <TacticIcon sm />, <PhysicalIcon sm />, <AttitudeIcon sm />];

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({
  title,
  rightAction,
  children,
  glowReverse = false,
  noPadBottom = false,
}: {
  title: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  glowReverse?: boolean;
  noPadBottom?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl px-5 pt-5 ${noPadBottom ? 'pb-1' : 'pb-5'} mb-4 relative overflow-hidden`}
      style={{ backgroundColor: '#201f1f' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: glowReverse
            ? 'linear-gradient(90deg, #00f4fe, #bcf521)'
            : 'linear-gradient(90deg, #bcf521, #00f4fe)',
        }}
      />
      <div className="flex items-center justify-between mb-4">
        <h3
          className="font-display font-semibold text-white uppercase"
          style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}
        >
          {title}
        </h3>
        {rightAction}
      </div>
      {children}
    </div>
  );
}

// ─── Desktop KPI card ─────────────────────────────────────────────────────────

function KpiCard({
  value,
  label,
  sublabel,
  delta,
  glowReverse = false,
}: {
  value: string;
  label: string;
  sublabel: string;
  delta?: number | null;
  glowReverse?: boolean;
}) {
  const positive = delta == null || delta >= 0;
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{ backgroundColor: '#201f1f' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: glowReverse
            ? 'linear-gradient(90deg, #00f4fe, #bcf521)'
            : 'linear-gradient(90deg, #bcf521, #00f4fe)',
        }}
      />
      {delta != null && (
        <p
          className="font-body font-semibold mb-1"
          style={{ fontSize: '0.65rem', color: positive ? '#bcf521' : '#b92902' }}
        >
          {positive ? '+' : ''}
          {delta.toFixed(1)}%
        </p>
      )}
      <p
        className="font-display font-bold text-white leading-none"
        style={{ fontSize: '1.6rem' }}
      >
        {value}
      </p>
      <p
        className="font-body uppercase text-on-surface-variant mt-1"
        style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
      >
        {label}
      </p>
      <p className="font-body text-xs text-on-surface-variant opacity-50 leading-tight">{sublabel}</p>
    </div>
  );
}

// ─── Desktop evaluation score card ───────────────────────────────────────────

function EvalScoreCard({
  label,
  score,
  date,
  icon,
}: {
  label: string;
  score: number;
  date: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{ backgroundColor: '#131313' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-white text-sm leading-tight">{label}</p>
          <p className="font-body text-xs text-on-surface-variant">{date}</p>
        </div>
        <p
          className="font-display font-bold text-primary shrink-0"
          style={{ fontSize: '1.35rem' }}
        >
          {score.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

// ─── Primary CTA ─────────────────────────────────────────────────────────────

function PrimaryCta({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-3xl font-display font-semibold text-on-primary text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
      style={{ background: 'linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)' }}
    >
      {strings.players.detail.newEvalCta}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCoach, isDirector } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['player', Number(id)],
    queryFn: () => playersApi.getProgress(Number(id)).then((r) => r.data),
    enabled: !!id,
  });

  const overallScore = useMemo(() => {
    if (!data?.averages) return 0;
    return Math.round(
      ((data.averages.technical + data.averages.tactical + data.averages.physical + data.averages.attitude) /
        4) *
        10,
    );
  }, [data?.averages]);

  const progressPct = useMemo(
    () => (data?.evaluations ? calcProgress(data.evaluations) : null),
    [data?.evaluations],
  );

  const evalItems = useMemo(
    () => (data?.evaluations ? buildEvalItems(data.evaluations) : []),
    [data?.evaluations],
  );

  const coachInsight = useMemo(() => {
    if (!data?.evaluations || data.evaluations.length === 0) return null;
    const sorted = [...data.evaluations].sort(
      (a, b) =>
        new Date(b.date ?? b.createdAt).getTime() - new Date(a.date ?? a.createdAt).getTime(),
    );
    return sorted.find((ev) => ev.notes)?.notes ?? null;
  }, [data?.evaluations]);

  const playerAge = useMemo(
    () => computeAge(data?.player?.birthdate),
    [data?.player?.birthdate],
  );

  const attendancePct = useMemo(() => {
    const s = data?.attendanceSummary;
    if (!s || s.totalSessions === 0) return null;
    return Math.round((s.attended / s.totalSessions) * 100);
  }, [data?.attendanceSummary]);

  const handleBack = () => {
    if (data?.player?.team) {
      navigate(`/teams/${data.player.team.id}/players`);
    } else {
      navigate(-1);
    }
  };

  const canEvaluate = isCoach || isDirector;

  return (
    <Layout>
      <div className="w-full max-w-screen-lg mx-auto">
        {/* Back button — full width on both viewports */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-body uppercase text-on-surface-variant hover:text-white transition-colors mb-6"
          style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {strings.players.detail.backLabel}
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-56">
            <p className="font-body text-sm text-on-surface-variant">{strings.common.loading}</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="rounded-2xl p-4 font-body text-sm text-white"
            style={{ backgroundColor: 'rgba(185,41,2,0.15)' }}
          >
            {strings.players.detail.errorLoading}
          </div>
        )}

        {data && (
          /**
           * Two-column grid on desktop.
           * Single column on mobile (left col renders first = correct natural order).
           */
          <div className="md:grid md:grid-cols-[300px_1fr] md:gap-6 md:items-start">

            {/* ════════════════════════════════════════
                LEFT COLUMN — Player identity panel
                ════════════════════════════════════════ */}
            <div className="md:sticky md:top-6">
              {/* Player header */}
              <div
                className="rounded-3xl p-5 mb-4 relative overflow-hidden"
                style={{ backgroundColor: '#201f1f' }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, #bcf521, #00f4fe)' }}
                />
                <PlayerHeader
                  name={data.player.name}
                  position={data.player.position}
                  teamName={data.player.team?.name}
                  category={data.player.team?.category}
                  age={playerAge}
                  totalEvaluations={data.evaluations?.length}
                  attendancePct={attendancePct}
                />
              </div>

              {/* Status card */}
              <StatusCard overallScore={overallScore} progressPct={progressPct} />

              {/* Radar chart */}
              {data.averages && (
                <SectionCard title={strings.players.detail.attributesHeading}>
                  <RadarChart
                    technical={data.averages.technical}
                    tactical={data.averages.tactical}
                    physical={data.averages.physical}
                    attitude={data.averages.attitude}
                  />
                </SectionCard>
              )}

              {/* Desktop-only secondary action */}
              {canEvaluate && (
                <button
                  onClick={() => navigate(`/players/${id}/evaluations/new`)}
                  className="hidden md:flex w-full items-center justify-center gap-2 py-3 rounded-2xl font-body font-semibold text-sm text-on-surface-variant uppercase tracking-wider hover:text-white transition-colors mb-4"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    backgroundColor: '#262626',
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  LOG WORKOUT
                </button>
              )}
            </div>

            {/* ════════════════════════════════════════
                RIGHT COLUMN — Analytics panel
                ════════════════════════════════════════ */}
            <div className="min-w-0">

              {/* Desktop-only KPI stats row */}
              {data.averages && (
                <div className="hidden md:grid md:grid-cols-3 md:gap-3 mb-4">
                  <KpiCard
                    value={overallScore.toString()}
                    label="OVR PROM."
                    sublabel="puntuación global"
                    delta={progressPct}
                  />
                  <KpiCard
                    value={(data.averages.technical * 10).toFixed(0)}
                    label="TÉCNICA"
                    sublabel="puntuación prom."
                    glowReverse
                    delta={
                      evalItems.find((i) => i.label === strings.players.detail.attrLabels[0])
                        ?.delta ?? null
                    }
                  />
                  <KpiCard
                    value={
                      attendancePct != null
                        ? `${attendancePct}%`
                        : (data.evaluations?.length ?? 0).toString()
                    }
                    label={attendancePct != null ? 'ASISTENCIA' : 'EVALUACIONES'}
                    sublabel={attendancePct != null ? 'de sesiones' : 'registradas'}
                  />
                </div>
              )}

              {/* Evolution chart */}
              {data.evaluations && data.evaluations.length > 0 && (
                <SectionCard title={strings.players.detail.evolutionHeading} glowReverse>
                  <EvolutionChart evaluations={data.evaluations} />
                </SectionCard>
              )}

              {/* Recent evaluations */}
              {evalItems.length > 0 && (
                <SectionCard
                  title={strings.players.detail.evaluationsHeading}
                  noPadBottom
                  rightAction={
                    <button
                      className="font-body text-primary uppercase hover:opacity-80 transition-opacity"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}
                      onClick={() => navigate(`/players/${id}/progress`)}
                    >
                      {strings.players.detail.viewAll}
                    </button>
                  }
                >
                  {/* Mobile: delta list */}
                  <div className="md:hidden pb-4">
                    {evalItems.slice(0, 4).map((item, i) => (
                      <div
                        key={item.label}
                        style={
                          i < Math.min(evalItems.length, 4) - 1
                            ? { borderBottom: '1px solid #262626' }
                            : undefined
                        }
                      >
                        <EvaluationItem
                          label={item.label}
                          delta={item.delta}
                          date={item.date}
                          icon={ATTR_ICONS_LG[item.iconIdx]}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Desktop: 2-col score cards */}
                  <div className="hidden md:grid md:grid-cols-2 md:gap-3 pb-5">
                    {evalItems.map((item) => (
                      <EvalScoreCard
                        key={item.label}
                        label={item.label}
                        score={item.score}
                        date={item.date}
                        icon={ATTR_ICONS_SM[item.iconIdx]}
                      />
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Coach insights */}
              {coachInsight && <CoachInsightsCard text={coachInsight} />}

              {/* Mobile CTA */}
              {canEvaluate && (
                <div className="md:hidden mt-4 mb-6">
                  <PrimaryCta onClick={() => navigate(`/players/${id}/evaluations/new`)} />
                </div>
              )}

              {/* Desktop CTA */}
              {canEvaluate && (
                <div className="hidden md:block mt-4 mb-2">
                  <PrimaryCta onClick={() => navigate(`/players/${id}/evaluations/new`)} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
