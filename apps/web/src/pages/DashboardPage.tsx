import { useNavigate } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { MetricCard } from "../components/MetricCard";
import { ActivityItem, type ActivitySignal } from "../components/ActivityItem";
import { TeamCard } from "../components/TeamCard";
import { MainCTA } from "../components/MainCTA";
import { MomentumWidget } from "../components/MomentumWidget";
import { useAuth } from "../hooks/useAuth";
import { teamsApi } from "../api/teams.api";
import { strings } from "../lib/strings";
import { playersApi } from "../api/players.api";
import type { Player, Evaluation } from "../types/player";

const ROLE_LABEL = strings.roles.greetingName;
const SCORE_LABEL = strings.scoreLabels;

interface PlayerRow {
  player: Player;
  signal: ActivitySignal;
  evaluationCount: number;
}

function computeSignal(evaluations: Evaluation[]): ActivitySignal {
  if (evaluations.length === 0) {
    return {
      description: strings.dashboard.activity.noEvaluations,
      color: "gray",
    };
  }
  if (evaluations.length === 1) {
    return {
      description: strings.dashboard.activity.recentlyEvaluated,
      color: "blue",
    };
  }

  const last = evaluations[evaluations.length - 1];
  const prev = evaluations[evaluations.length - 2];

  const deltas = (
    [
      "technicalScore",
      "tacticalScore",
      "physicalScore",
      "attitudeScore",
    ] as const
  ).map((key) => ({ label: SCORE_LABEL[key], delta: last[key] - prev[key] }));

  const biggest = deltas.reduce((a, b) =>
    Math.abs(a.delta) >= Math.abs(b.delta) ? a : b,
  );

  if (biggest.delta === 0) {
    return { description: strings.dashboard.activity.noChanges, color: "gray" };
  }

  const sign = biggest.delta > 0 ? "+" : "";
  return {
    description: biggest.label,
    badge: `${sign}${biggest.delta}`,
    color: biggest.delta > 0 ? "green" : "red",
  };
}

// ─── Icon helpers (for metric cards) ────────────────────────────────────────

function IconGroups() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zM16.2 13h2.8v6h-2.8v-6z" />
    </svg>
  );
}

// ─── Action button (right panel & mobile) ────────────────────────────────────

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-surface-high rounded-2xl px-4 py-3.5 hover:bg-surface-highest transition-colors group"
    >
      <span className="text-on-surface-variant shrink-0">{icon}</span>
      <span className="font-display text-sm font-semibold text-white flex-1 text-left">
        {label}
      </span>
      <svg
        className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  );
}

function PersonPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isDirector, isCoach, logout } = useAuth();
  const navigate = useNavigate();

  const primaryRole = Array.isArray(user?.role) ? user?.role[0] : user?.role;
  const greetingName = primaryRole ? (ROLE_LABEL[primaryRole] ?? primaryRole) : "";
  const isStaff = isDirector || isCoach;

  // 1. Teams
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list().then((r) => r.data),
    enabled: isStaff,
  });

  // 2. Players per team
  const playerQueries = useQueries({
    queries: teams.map((team) => ({
      queryKey: ['players', team.id] as const,
      queryFn: () => playersApi.list(team.id).then((r) => r.data),
    })),
  });

  const playersLoading = playerQueries.some((q) => q.isLoading);
  const allPlayers = playerQueries.flatMap((q) => q.data ?? []);
  const teamPlayerCounts = new Map(
    teams.map((team, i) => [team.id, playerQueries[i]?.data?.length ?? 0]),
  );
  const totalPlayers = allPlayers.length;

  // 3. Progress for first 6 players
  const sample = allPlayers.slice(0, 6);
  const progressQueries = useQueries({
    queries: sample.map((player) => ({
      queryKey: ['player-progress', player.id] as const,
      queryFn: () => playersApi.getProgress(player.id).then((r) => r.data),
    })),
  });

  const progressLoading = progressQueries.some((q) => q.isLoading);

  const loadingMetrics = teamsLoading || playersLoading;
  const loadingActivity = playersLoading || progressLoading;

  const playerRows: PlayerRow[] = sample.map((player, i) => {
    const progress = progressQueries[i]?.data;
    const evals = progress?.evaluations ?? [];
    return {
      player,
      signal: computeSignal(evals),
      evaluationCount: evals.length,
    };
  });

  const totalEvaluations = playerRows.reduce((sum, r) => sum + r.evaluationCount, 0);
  const evaluatedCount = playerRows.filter((r) => r.evaluationCount > 0).length;
  const pendingCount = Math.max(0, playerRows.length - evaluatedCount);

  const adminActions = [
    {
      label: strings.dashboard.actions.createTeam,
      icon: <PlusCircleIcon />,
      to: "/teams/new",
      show: isDirector || isCoach,
    },
    {
      label: strings.dashboard.actions.inviteUser,
      icon: <PersonPlusIcon />,
      to: "/invite",
      show: isDirector,
    },
    {
      label: strings.dashboard.actions.createAcademy,
      icon: <PlusCircleIcon />,
      to: "/admin/academies/new",
      show: primaryRole === "SUPER_ADMIN",
    },
  ].filter((a) => a.show);

  return (
    <Layout>
      {/* ── Two-column grid on desktop ── */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
        {/* ── Left / main column ── */}
        <div className="w-full md:flex-1 min-w-0 space-y-5">
          {/* Mobile greeting */}
          {greetingName && (
            <div className="md:hidden">
              <h1
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: "1.5rem" }}
              >
                {strings.dashboard.greeting.academy}
                <br />
              </h1>
            </div>
          )}

          {/* ── Metrics row ── */}
          {isStaff && (
            <div className="grid grid-cols-3 gap-3">
              {loadingMetrics ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-surface-high animate-pulse rounded-3xl h-24 md:h-32"
                    />
                  ))}
                </>
              ) : (
                <>
                  <MetricCard
                    label={strings.dashboard.metrics.activeTeams}
                    value={teams.length}
                    sub={
                      teams.length > 0
                        ? strings.dashboard.metrics.activeTeamsSub(teams.length)
                        : undefined
                    }
                    icon={<IconGroups />}
                  />
                  <MetricCard
                    label={strings.dashboard.metrics.totalPlayers}
                    value={totalPlayers}
                    sub={
                      evaluatedCount > 0
                        ? strings.dashboard.metrics.totalPlayersSub(evaluatedCount)
                        : undefined
                    }
                    icon={<IconPerson />}
                  />
                  <MetricCard
                    label={strings.dashboard.metrics.evaluations}
                    value={totalEvaluations}
                    sub={
                      pendingCount > 0
                        ? strings.dashboard.metrics.evaluationsSub(pendingCount)
                        : undefined
                    }
                    icon={<IconChart />}
                  />
                </>
              )}
            </div>
          )}

          {/* ── CTA banner ── */}
          {isStaff && (
            <MainCTA
              title={strings.dashboard.cta.title}
              subtitle={strings.dashboard.cta.subtitle}
              onClick={() => navigate("/teams")}
            />
          )}

          {/* ── Activity section ── */}
          {isStaff && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-display font-bold text-white"
                  style={{ fontSize: "1.1rem" }}
                >
                  {strings.dashboard.activity.heading}
                </h2>
                {!loadingActivity && playerRows.length > 0 && (
                  <button
                    onClick={() => navigate("/teams")}
                    className="font-body text-xs font-semibold uppercase text-primary hover:opacity-80 transition-opacity"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {strings.dashboard.activity.viewHistory}
                  </button>
                )}
              </div>

              {loadingActivity ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-surface-high animate-pulse rounded-2xl h-16"
                    />
                  ))}
                </div>
              ) : playerRows.length === 0 ? (
                <div className="bg-surface-high rounded-3xl p-8 text-center">
                  <p className="font-display text-sm font-medium text-white">
                    {strings.dashboard.activity.emptyTitle}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant mt-1">
                    {strings.dashboard.activity.emptyDescription}
                  </p>
                  <button
                    onClick={() => navigate("/teams")}
                    className="mt-4 font-body text-sm text-primary hover:opacity-80 transition-opacity font-medium"
                  >
                    {strings.dashboard.activity.goToTeams}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {playerRows.map(({ player, signal }) => (
                    <ActivityItem
                      key={player.id}
                      name={player.name}
                      position={player.position}
                      signal={signal}
                      onClick={() => navigate(`/players/${player.id}/progress`)}
                    />
                  ))}
                  {totalPlayers > 6 && (
                    <button
                      onClick={() => navigate("/teams")}
                      className="w-full font-body text-sm text-on-surface-variant hover:text-primary transition-colors py-2 text-center"
                    >
                      {strings.dashboard.activity.viewAllPlayers(totalPlayers)}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Teams (mobile only) ── */}
          {isStaff && !loadingMetrics && teams.length > 0 && (
            <div className="md:hidden">
              <h2
                className="font-display font-bold text-white mb-3"
                style={{ fontSize: "1.1rem" }}
              >
                Mis equipos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    name={team.name}
                    category={team.category}
                    playerCount={teamPlayerCounts.get(team.id)}
                    onClick={() => navigate(`/teams/${team.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Admin actions (mobile only) ── */}
          {adminActions.length > 0 && (
            <div className="space-y-2">
              {adminActions.map((action) => (
                <ActionButton
                  key={action.to}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => navigate(action.to)}
                />
              ))}
            </div>
          )}

          {/* Parent view */}
          {!isStaff && primaryRole !== "SUPER_ADMIN" && (
            <div className="text-center py-16">
              <p className="font-body text-sm text-on-surface-variant">
                {strings.dashboard.parent.welcome}
              </p>
            </div>
          )}

          {/* Logout — testing only */}
          <div className="pt-4 pb-2 flex justify-center">
            <button
              onClick={logout}
              className="font-body text-xs font-semibold uppercase text-on-surface-variant hover:text-primary transition-colors"
              style={{ letterSpacing: "0.05em" }}
            >
              {strings.nav.logout}
            </button>
          </div>
        </div>

        {/* ── Right panel (desktop only) ── */}
        {isStaff && (
          <div className="hidden md:flex flex-col gap-4 w-72 xl:w-80 shrink-0">
            {/* Teams */}
            {!loadingMetrics && teams.length > 0 && (
              <div>
                <h2
                  className="font-display font-bold text-white mb-3"
                  style={{ fontSize: "1.1rem" }}
                >
                  {strings.dashboard.teams.heading}
                </h2>
                <div className="space-y-3">
                  {teams.slice(0, 2).map((team) => (
                    <TeamCard
                      key={team.id}
                      name={team.name}
                      category={team.category}
                      playerCount={teamPlayerCounts.get(team.id)}
                      onClick={() => navigate(`/teams/${team.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Admin actions */}
            {adminActions.length > 0 && (
              <div className="space-y-2">
                {adminActions.map((action) => (
                  <ActionButton
                    key={action.to}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => navigate(action.to)}
                  />
                ))}
              </div>
            )}

            {/* Momentum widget */}
            {!loadingActivity && (
              <MomentumWidget
                evaluatedCount={evaluatedCount}
                total={playerRows.length}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
