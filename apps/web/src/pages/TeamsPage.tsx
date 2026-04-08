import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { teamsApi } from '../api/teams.api';
import { useAuth } from '../hooks/useAuth';
import { strings } from '../lib/strings';

export default function TeamsPage() {
  const navigate = useNavigate();
  const { isDirector, isCoach } = useAuth();

  const { data: teams = [], isLoading, isError, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list().then((r) => r.data),
  });

  const errorMsg = isError ? ((error as any)?.response?.data?.message ?? strings.teams.errorLoading) : '';

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{strings.teams.heading}</h1>
          {(isDirector || isCoach) && (
            <button
              onClick={() => navigate('/teams/new')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              {strings.teams.newButton}
            </button>
          )}
        </div>

        {isLoading && <p className="text-sm text-gray-400">{strings.common.loading}</p>}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {!isLoading && teams.length === 0 && !errorMsg && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">{strings.teams.empty}</p>
            {(isDirector || isCoach) && (
              <button
                onClick={() => navigate('/teams/new')}
                className="mt-4 text-indigo-600 text-sm hover:underline"
              >
                {strings.teams.createFirst}
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
