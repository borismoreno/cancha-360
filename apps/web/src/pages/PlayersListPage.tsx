import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { playersApi } from '../api/players.api';
import { useAuth } from '../hooks/useAuth';
import type { Player } from '../types/player';

export default function PlayersListPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isCoach, isDirector } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    playersApi
      .list(Number(teamId))
      .then((res) => setPlayers(res.data))
      .catch((err) => setError(err?.response?.data?.message ?? 'Error al cargar jugadores'))
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
            ← Equipo
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Jugadores</h1>
            <p className="text-sm text-gray-500 mt-0.5">Equipo #{teamId}</p>
          </div>
          {(isCoach || isDirector) && (
            <button
              onClick={() => navigate(`/teams/${teamId}/players/new`)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              + Agregar Jugador
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-400">Cargando...</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && players.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No hay jugadores registrados.</p>
            {(isCoach || isDirector) && (
              <button
                onClick={() => navigate(`/teams/${teamId}/players/new`)}
                className="mt-4 text-indigo-600 text-sm hover:underline"
              >
                Agregar el primer jugador
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800">{player.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {player.position ?? 'Sin posición'} · ID: {player.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/players/${player.id}/progress`)}
                    className="flex-1 sm:flex-none text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Progreso
                  </button>
                  {(isCoach || isDirector) && (
                    <button
                      onClick={() => navigate(`/players/${player.id}/evaluations/new`)}
                      className="flex-1 sm:flex-none text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-md text-sm transition-colors"
                    >
                      Evaluar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
