import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { playersApi } from '../api/players.api';
import { teamsApi } from '../api/teams.api';
import { useAuth } from '../hooks/useAuth';
import { strings } from '../lib/strings';

export default function PlayersListPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isCoach, isDirector } = useAuth();
  const id = Number(teamId);

  const { data: team } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getOne(id).then((r) => r.data),
    enabled: !!teamId,
  });

  const { data: players = [], isLoading, isError, error } = useQuery({
    queryKey: ['players', id],
    queryFn: () => playersApi.list(id).then((r) => r.data),
    enabled: !!teamId,
  });

  const errorMsg = isError ? ((error as any)?.response?.data?.message ?? strings.players.errorLoading) : '';

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(`/teams/${teamId}`)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← {team ? team.name : strings.teams.teamFallback}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{strings.players.heading}</h1>
            {team && (
              <p className="text-sm text-gray-500 mt-0.5">{team.name} · {team.category}</p>
            )}
          </div>
          {(isCoach || isDirector) && (
            <button
              onClick={() => navigate(`/teams/${teamId}/players/new`)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              {strings.players.addButton}
            </button>
          )}
        </div>

        {isLoading && <p className="text-sm text-gray-400">{strings.common.loading}</p>}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {!isLoading && players.length === 0 && !errorMsg && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">{strings.players.empty}</p>
            {(isCoach || isDirector) && (
              <button
                onClick={() => navigate(`/teams/${teamId}/players/new`)}
                className="mt-4 text-indigo-600 text-sm hover:underline"
              >
                {strings.players.addFirst}
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
                    {player.position ?? strings.players.noPosition}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/players/${player.id}/progress`)}
                    className="flex-1 sm:flex-none text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    {strings.players.progressButton}
                  </button>
                  {(isCoach || isDirector) && (
                    <button
                      onClick={() => navigate(`/players/${player.id}/evaluations/new`)}
                      className="flex-1 sm:flex-none text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-md text-sm transition-colors"
                    >
                      {strings.players.evaluateButton}
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
