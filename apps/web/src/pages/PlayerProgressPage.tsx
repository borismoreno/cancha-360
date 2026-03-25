import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { playersApi } from '../api/players.api';
import { useAuth } from '../hooks/useAuth';
import type { PlayerProgress } from '../types/player';

export default function PlayerProgressPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { isCoach, isDirector } = useAuth();
  const [data, setData] = useState<PlayerProgress | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playersApi
      .getProgress(Number(playerId))
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message ?? 'Error al cargar progreso'))
      .finally(() => setLoading(false));
  }, [playerId]);

  const scoreCards = data
    ? [
        { label: 'Técnico', value: data.averages?.technical },
        { label: 'Táctico', value: data.averages?.tactical },
        { label: 'Físico', value: data.averages?.physical },
        { label: 'Actitud', value: data.averages?.attitude },
      ]
    : [];

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Progreso del Jugador</h1>
            <p className="text-sm text-gray-500 mt-0.5">ID: {playerId}</p>
          </div>
          {(isCoach || isDirector) && (
            <button
              onClick={() => navigate(`/players/${playerId}/evaluations/new`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              Nueva evaluación
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-400">Cargando...</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-gray-800 text-lg">{data.player.name}</h2>
              {data.player.position && (
                <p className="text-sm text-gray-500 mt-0.5">Posición: {data.player.position}</p>
              )}

              {data.averages && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {scoreCards.map(({ label, value }) => (
                    <div key={label} className="bg-indigo-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-indigo-500 font-medium mb-1">{label}</p>
                      <p className="text-2xl font-bold text-indigo-800">
                        {value != null ? value.toFixed(1) : '—'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 mb-3">Historial de evaluaciones</h3>

            {(!data.evaluations || data.evaluations.length === 0) && (
              <p className="text-sm text-gray-400">Sin evaluaciones registradas.</p>
            )}

            <div className="space-y-3">
              {data.evaluations?.map((ev) => (
                <div key={ev.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-4 gap-4 text-sm flex-1">
                      {[
                        { label: 'Técnico', value: ev.technicalScore },
                        { label: 'Táctico', value: ev.tacticalScore },
                        { label: 'Físico', value: ev.physicalScore },
                        { label: 'Actitud', value: ev.attitudeScore },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <span className="text-gray-400 text-xs block">{label}</span>
                          <span className="font-semibold text-gray-800">{value}/10</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(ev.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {ev.notes && (
                    <p className="mt-2 text-sm text-gray-500 italic border-t border-gray-100 pt-2">
                      {ev.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
