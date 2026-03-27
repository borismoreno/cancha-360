import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { academiesApi } from "../api/academies.api";
import { teamsApi } from "../api/teams.api";
import { playersApi } from "../api/players.api";
import type { Academy } from "../types/academy";
import type { Team } from "../types/team";
import type { Player, Evaluation } from "../types/player";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  DIRECTOR: "Director",
  COACH: "Entrenador",
  PARENT: "Padre / Tutor",
};

const SCORE_LABEL: Record<string, string> = {
  technicalScore: "Técnica",
  tacticalScore: "Táctica",
  physicalScore: "Físico",
  attitudeScore: "Actitud",
};

type SignalColor = "green" | "red" | "blue" | "gray";

interface ActivitySignal {
  text: string;
  color: SignalColor;
}

interface PlayerRow {
  player: Player;
  signal: ActivitySignal;
  evaluationCount: number;
}

function computeSignal(evaluations: Evaluation[]): ActivitySignal {
  if (evaluations.length === 0) {
    return { text: "Sin evaluaciones aún", color: "gray" };
  }
  if (evaluations.length === 1) {
    return { text: "Evaluado recientemente", color: "blue" };
  }

  const last = evaluations[evaluations.length - 1];
  const prev = evaluations[evaluations.length - 2];

  const deltas = (
    ["technicalScore", "tacticalScore", "physicalScore", "attitudeScore"] as const
  ).map((key) => ({
    label: SCORE_LABEL[key],
    delta: last[key] - prev[key],
  }));

  const biggest = deltas.reduce((a, b) =>
    Math.abs(a.delta) >= Math.abs(b.delta) ? a : b
  );

  if (biggest.delta === 0) {
    return { text: "Sin cambios recientes", color: "gray" };
  }

  const sign = biggest.delta > 0 ? "+" : "";
  return {
    text: `${biggest.label} ${sign}${biggest.delta}`,
    color: biggest.delta > 0 ? "green" : "red",
  };
}

const SIGNAL_STYLES: Record<SignalColor, string> = {
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-400",
};

function MetricCard({
  value,
  label,
  sub,
}: {
  value: number | string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-1">
      <span className="text-3xl font-bold text-indigo-700">{value}</span>
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isDirector, isCoach } = useAuth();
  const navigate = useNavigate();

  const [academy, setAcademy] = useState<Academy | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerRows, setPlayerRows] = useState<PlayerRow[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const primaryRole = Array.isArray(user?.role) ? user?.role[0] : user?.role;
  const roleLabel = primaryRole ? (ROLE_LABEL[primaryRole] ?? primaryRole) : "";

  useEffect(() => {
    const promises: Promise<unknown>[] = [];

    if (user?.academyId) {
      promises.push(
        academiesApi
          .getCurrent()
          .then((res) => setAcademy(res.data))
          .catch(() => {})
      );
    }

    if (isDirector || isCoach) {
      promises.push(
        teamsApi
          .list()
          .then(async (res) => {
            const teamList = res.data ?? [];
            setTeams(teamList);

            const playerResults = await Promise.allSettled(
              teamList.map((t) => playersApi.list(t.id))
            );
            const allPlayers: Player[] = [];
            playerResults.forEach((r) => {
              if (r.status === "fulfilled") allPlayers.push(...r.value.data);
            });
            setTotalPlayers(allPlayers.length);
            setLoadingMetrics(false);

            // Fetch progress for up to 6 players to show activity
            const sample = allPlayers.slice(0, 6);
            const progressResults = await Promise.allSettled(
              sample.map((p) => playersApi.getProgress(p.id))
            );

            const rows: PlayerRow[] = [];
            progressResults.forEach((r, i) => {
              if (r.status === "fulfilled") {
                rows.push({
                  player: sample[i],
                  signal: computeSignal(r.value.data.evaluations ?? []),
                  evaluationCount: r.value.data.evaluations?.length ?? 0,
                });
              } else {
                rows.push({
                  player: sample[i],
                  signal: { text: "Evaluado recientemente", color: "blue" },
                  evaluationCount: 0,
                });
              }
            });
            setPlayerRows(rows);
          })
          .catch(() => {
            setLoadingMetrics(false);
          })
          .finally(() => setLoadingActivity(false))
      );
    } else {
      setLoadingMetrics(false);
      setLoadingActivity(false);
    }

    Promise.allSettled(promises);
  }, [user?.academyId, isDirector, isCoach]);

  const adminActions = [
    {
      title: "Crear Equipo",
      description: "Agregar un nuevo equipo a la academia.",
      to: "/teams/new",
      show: isDirector || isCoach,
    },
    {
      title: "Invitar Entrenador o Padre",
      description: "Enviar invitación por correo electrónico.",
      to: "/invite",
      show: isDirector,
    },
    {
      title: "Crear Academia",
      description: "Registrar una nueva academia en el sistema.",
      to: "/admin/academies/new",
      show: primaryRole === "SUPER_ADMIN",
    },
  ].filter((a) => a.show);

  const evaluatedCount = playerRows.filter((r) => r.evaluationCount > 0).length;

  return (
    <Layout>
      <div className="w-full max-w-2xl space-y-8">

        {/* 1 — Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {academy ? academy.name : "Tu academia en un vistazo"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{roleLabel}</p>
        </div>

        {/* 2 — Metrics */}
        {(isDirector || isCoach) && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Estado actual
            </h2>
            {loadingMetrics ? (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-24" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  value={teams.length}
                  label={teams.length === 1 ? "Equipo activo" : "Equipos activos"}
                  sub={
                    teams.length > 0
                      ? teams.map((t) => t.name).slice(0, 2).join(", ") +
                        (teams.length > 2 ? "..." : "")
                      : undefined
                  }
                />
                <MetricCard
                  value={totalPlayers}
                  label={totalPlayers === 1 ? "Jugador en seguimiento" : "Jugadores en seguimiento"}
                  sub={
                    evaluatedCount > 0
                      ? `${evaluatedCount} con evaluaciones`
                      : "Aún sin evaluaciones"
                  }
                />
              </div>
            )}

            {!loadingMetrics && totalPlayers > 0 && evaluatedCount === 0 && (
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Registra evaluaciones para ver el progreso de cada jugador en tiempo real.
              </p>
            )}
          </div>
        )}

        {/* 3 — Primary CTA */}
        {(isDirector || isCoach) && (
          <button
            onClick={() => navigate("/teams")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 px-6 text-left transition-colors group"
          >
            <p className="text-base font-semibold">
              Ver cómo están mejorando tus jugadores
            </p>
            <p className="text-sm text-indigo-200 mt-0.5">
              Evaluaciones, asistencia y evolución individual de cada jugador.
            </p>
          </button>
        )}

        {/* 4 — Player activity */}
        {(isDirector || isCoach) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Actividad reciente de jugadores
              </h2>
              {totalPlayers > 6 && !loadingActivity && (
                <button
                  onClick={() => navigate("/teams")}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Ver todos →
                </button>
              )}
            </div>

            {loadingActivity ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-16" />
                ))}
              </div>
            ) : playerRows.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Aún no has registrado evaluaciones.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Empieza a evaluar a tus jugadores para ver su progreso aquí.
                </p>
                <button
                  onClick={() => navigate("/teams")}
                  className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium"
                >
                  Ir a mis equipos →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {playerRows.map(({ player, signal, evaluationCount }) => (
                  <button
                    key={player.id}
                    onClick={() => navigate(`/players/${player.id}/progress`)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {player.name}
                        {player.position && (
                          <span className="font-normal text-gray-400">
                            {" "}— {player.position}
                          </span>
                        )}
                      </p>
                      {evaluationCount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {evaluationCount}{" "}
                          {evaluationCount === 1 ? "evaluación" : "evaluaciones"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${SIGNAL_STYLES[signal.color]}`}
                      >
                        {signal.text}
                      </span>
                    </div>
                  </button>
                ))}

                {totalPlayers > 6 && (
                  <button
                    onClick={() => navigate("/teams")}
                    className="w-full text-sm text-gray-400 hover:text-indigo-600 transition-colors py-2 text-center"
                  >
                    Ver los {totalPlayers} jugadores →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5 — Teams quick list */}
        {(isDirector || isCoach) && !loadingMetrics && teams.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Mis equipos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {team.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{team.category}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6 — Admin actions */}
        {adminActions.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Gestión de la academia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {adminActions.map((action) => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <p className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PARENT */}
        {!isDirector && !isCoach && primaryRole !== "SUPER_ADMIN" && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">
              Bienvenido. Tu entrenador compartirá el progreso de tu jugador aquí.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
