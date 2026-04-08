import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { teamsApi } from '../api/teams.api';
import { strings } from '../lib/strings';

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isCoach, isDirector } = useAuth();

  const { data: team } = useQuery({
    queryKey: ['team', Number(teamId)],
    queryFn: () => teamsApi.getOne(Number(teamId)).then((r) => r.data),
    enabled: !!teamId,
  });

  const actions = [
    {
      label: strings.teams.detail.players,
      description: strings.teams.detail.playersDescription,
      to: `/teams/${teamId}/players`,
      show: true,
    },
    {
      label: strings.teams.detail.coaches,
      description: strings.teams.detail.coachesDescription,
      to: `/teams/${teamId}/coaches`,
      show: isCoach || isDirector,
    },
    {
      label: strings.teams.detail.sessions,
      description: strings.teams.detail.sessionsDescription,
      to: `/teams/${teamId}/sessions`,
      show: isCoach || isDirector,
    },
    {
      label: strings.teams.detail.newSchedule,
      description: strings.teams.detail.newScheduleDescription,
      to: `/teams/${teamId}/training-schedules/new`,
      show: isCoach || isDirector,
    },
  ].filter((a) => a.show);

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/teams')}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            {strings.teams.backToTeams}
          </button>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {team ? team.name : '...'}
        </h1>
        {team && (
          <p className="text-sm text-gray-500 mb-6">{team.category}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.to}
              onClick={() => navigate(action.to)}
              className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-sm transition-all group"
            >
              <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {action.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
