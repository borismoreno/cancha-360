import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { playersApi } from '../api/players.api';
import { useAuth } from '../hooks/useAuth';
import type { PlayerProgress } from '../types/player';
import { strings } from '../lib/strings';

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
      .catch((err) => setError(err?.response?.data?.message ?? strings.players.progress.errorLoading))
      .finally(() => setLoading(false));
  }, [playerId]);

  const scoreCards = data
    ? [
        { label: strings.players.progress.technicalLabel, value: data.averages?.technical },
        { label: strings.players.progress.tacticalLabel, value: data.averages?.tactical },
        { label: strings.players.progress.physicalLabel, value: data.averages?.physical },
        { label: strings.players.progress.attitudeLabel, value: data.averages?.attitude },
      ]
    : [];

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        {data?.player?.team && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(`/teams/${data.player.team!.id}/players`)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ← {data.player.team.name}
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {data ? data.player.name : strings.players.progress.defaultTitle}
            </h1>
            {data?.player?.team && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.player.team.name} · {data.player.team.category}
              </p>
            )}
          </div>
          {(isCoach || isDirector) && (
            <button
              onClick={() => navigate(`/players/${playerId}/evaluations/new`)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md text-sm transition-colors"
            >
              {strings.players.progress.newEvaluation}
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-400">{strings.common.loading}</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="font-semibold text-gray-800 text-lg">{data.player.name}</h2>
                  {data.player.position && (
                    <p className="text-sm text-gray-500 mt-0.5">{data.player.position}</p>
                  )}
                </div>
                {data.attendanceSummary && data.attendanceSummary.totalSessions > 0 && (
                  <div className="sm:ml-auto flex gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-400">{strings.players.progress.sessionsLabel}</p>
                      <p className="text-lg font-bold text-gray-800">{data.attendanceSummary.totalSessions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-500">{strings.players.progress.attendedLabel}</p>
                      <p className="text-lg font-bold text-green-700">{data.attendanceSummary.attended}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-400">{strings.players.progress.missedLabel}</p>
                      <p className="text-lg font-bold text-red-600">{data.attendanceSummary.missed}</p>
                    </div>
                  </div>
                )}
              </div>

              {data.averages && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

            <h3 className="font-semibold text-gray-800 mb-3">{strings.players.progress.historyHeading}</h3>

            {(!data.evaluations || data.evaluations.length === 0) && (
              <p className="text-sm text-gray-400">{strings.players.progress.noEvaluations}</p>
            )}

            <div className="space-y-3">
              {data.evaluations?.map((ev) => (
                <div key={ev.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(ev.date ?? ev.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {[
                      { label: strings.players.progress.technicalLabel, value: ev.technicalScore },
                      { label: strings.players.progress.tacticalLabel, value: ev.tacticalScore },
                      { label: strings.players.progress.physicalLabel, value: ev.physicalScore },
                      { label: strings.players.progress.attitudeLabel, value: ev.attitudeScore },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-md p-2">
                        <span className="text-gray-400 text-xs block">{label}</span>
                        <span className="font-semibold text-gray-800">{value}{strings.common.scoreSuffix}</span>
                      </div>
                    ))}
                  </div>
                  {ev.notes && (
                    <p className="mt-3 text-sm text-gray-500 italic border-t border-gray-100 pt-2">
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
