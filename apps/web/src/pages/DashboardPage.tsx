import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { academiesApi } from "../api/academies.api";
import { teamsApi } from "../api/teams.api";
import { playersApi } from "../api/players.api";
import type { Academy } from "../types/academy";
import type { Team } from "../types/team";
import type { Player } from "../types/player";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  DIRECTOR: "Director",
  COACH: "Entrenador",
  PARENT: "Padre / Tutor",
};

function MetricCard({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-1">
      <span className="text-3xl font-bold text-indigo-700">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isDirector, isCoach } = useAuth();
  const navigate = useNavigate();

  const [academy, setAcademy] = useState<Academy | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const primaryRole = Array.isArray(user?.role) ? user?.role[0] : user?.role;
  const roleLabel = primaryRole ? (ROLE_LABEL[primaryRole] ?? primaryRole) : "";

  useEffect(() => {
    const promises: Promise<unknown>[] = [];

    if (user?.academyId) {
      promises.push(
        academiesApi.getCurrent().then((res) => setAcademy(res.data)).catch(() => {})
      );
    }

    if (isDirector || isCoach) {
      promises.push(
        teamsApi.list().then(async (res) => {
          const teamList = res.data ?? [];
          setTeams(teamList);
          const playerResults = await Promise.allSettled(
            teamList.map((t) => playersApi.list(t.id))
          );
          const all: Player[] = [];
          playerResults.forEach((r) => {
            if (r.status === "fulfilled") all.push(...r.value.data);
          });
          setPlayers(all);
        }).catch(() => {})
      );
    }

    Promise.allSettled(promises).finally(() => setLoadingMetrics(false));
  }, [user?.academyId, isDirector, isCoach]);

  const adminActions = [
    {
      title: "Crear Equipo",
      description: "Agregar un nuevo equipo a la academia.",
      to: "/teams/new",
      show: isDirector || isCoach,
    },
    {
      title: "Invitar Usuario",
      description: "Enviar invitación a un entrenador o padre.",
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
              Resumen de tu academia
            </h2>
            {loadingMetrics ? (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <MetricCard value={teams.length} label="Equipos activos" />
                <MetricCard value={players.length} label="Jugadores registrados" />
              </div>
            )}
          </div>
        )}

        {/* 3 — Primary CTA */}
        {(isDirector || isCoach) && (
          <button
            onClick={() => navigate("/teams")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 px-6 text-left transition-colors group"
          >
            <p className="text-base font-semibold group-hover:underline">
              Ver progreso de jugadores
            </p>
            <p className="text-sm text-indigo-200 mt-0.5">
              Accede a evaluaciones, asistencia y estadísticas de cada jugador.
            </p>
          </button>
        )}

        {/* 4 — Player activity */}
        {(isDirector || isCoach) && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Actividad reciente de jugadores
            </h2>

            {loadingMetrics ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-14" />
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-400">
                  Aún no hay evaluaciones registradas.
                </p>
                <button
                  onClick={() => navigate("/teams")}
                  className="mt-3 text-sm text-indigo-600 hover:underline font-medium"
                >
                  Ir a mis equipos para evaluar jugadores →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {players.slice(0, 5).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => navigate(`/players/${player.id}/progress`)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {player.name}
                      </p>
                      {player.position && (
                        <p className="text-xs text-gray-400 truncate">
                          {player.position}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-indigo-500 font-medium group-hover:underline shrink-0">
                      Ver progreso →
                    </span>
                  </button>
                ))}

                {players.length > 5 && (
                  <button
                    onClick={() => navigate("/teams")}
                    className="w-full text-sm text-gray-400 hover:text-indigo-600 transition-colors py-2 text-center"
                  >
                    Ver todos los jugadores ({players.length}) →
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

        {/* PARENT / empty state */}
        {!isDirector && !isCoach && primaryRole !== "SUPER_ADMIN" && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Bienvenido. Tu entrenador compartirá el progreso de tu jugador aquí.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
