import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { teamsApi } from '../api/teams.api';
import { useAuth } from '../hooks/useAuth';
import type { Team } from '../types/team';

export default function TeamsPage() {
  const navigate = useNavigate();
  const { isDirector, isCoach } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    teamsApi
      .list()
      .then((res) => setTeams(res.data))
      .catch((err) => setError(err?.response?.data?.message ?? 'Error al cargar equipos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mis Equipos</h1>
          {(isDirector || isCoach) && (
            <button
              onClick={() => navigate('/teams/new')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              + Nuevo Equipo
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-400">Cargando...</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && teams.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No hay equipos registrados.</p>
            {(isDirector || isCoach) && (
              <button
                onClick={() => navigate('/teams/new')}
                className="mt-4 text-indigo-600 text-sm hover:underline"
              >
                Crear el primer equipo
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-sm transition-all group"
            >
              <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {team.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{team.category}</p>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
