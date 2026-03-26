import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { trainingsApi } from '../api/trainings.api';
import { teamsApi } from '../api/teams.api';
import type { TrainingSession } from '../types/training';
import type { Team } from '../types/team';

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: 'Programada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

const STATUS_COLOR: Record<string, string> = {
  SCHEDULED: 'bg-blue-50 text-blue-700',
  CANCELLED: 'bg-red-50 text-red-700',
  COMPLETED: 'bg-green-50 text-green-700',
};

export default function SessionsListPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = Number(teamId);
    Promise.all([
      trainingsApi.listSessions(id),
      teamsApi.getOne(id),
    ])
      .then(([sessionsRes, teamRes]) => {
        setSessions(sessionsRes.data);
        setTeam(teamRes.data);
      })
      .catch((err) => setError(err?.response?.data?.message ?? 'Error al cargar sesiones'))
      .finally(() => setLoading(false));
  }, [teamId]);

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(`/teams/${teamId}`)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← {team ? team.name : 'Equipo'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Sesiones de Entrenamiento</h1>
            {team && (
              <p className="text-sm text-gray-500 mt-0.5">{team.name} · {team.category}</p>
            )}
          </div>
          <button
            onClick={() => navigate(`/teams/${teamId}/training-schedules/new`)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            + Nuevo Horario
          </button>
        </div>

        {loading && <p className="text-sm text-gray-400">Cargando...</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && sessions.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No hay sesiones programadas.</p>
            <button
              onClick={() => navigate(`/teams/${teamId}/training-schedules/new`)}
              className="mt-4 text-indigo-600 text-sm hover:underline"
            >
              Crear un horario de entrenamiento
            </button>
          </div>
        )}

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800">
                    {new Date(session.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[session.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_LABEL[session.status] ?? session.status}
                    </span>
                    {session.cancelReason && (
                      <span className="text-xs text-gray-400 italic">{session.cancelReason}</span>
                    )}
                  </div>
                </div>
                {session.status === 'SCHEDULED' && (
                  <button
                    onClick={() => navigate(`/training-sessions/${session.id}`)}
                    className="w-full sm:w-auto text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
                  >
                    Gestionar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
