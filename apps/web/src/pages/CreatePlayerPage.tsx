import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { playersApi } from '../api/players.api';
import { teamsApi } from '../api/teams.api';
import type { Team } from '../types/team';
import { strings } from '../lib/strings';

export default function CreatePlayerPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    position: '',
    parentName: '',
    parentEmail: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamId) {
      teamsApi.getOne(Number(teamId)).then((res) => setTeam(res.data)).catch(() => {});
    }
  }, [teamId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await playersApi.create(Number(teamId), {
        name: form.name,
        birthdate: form.birthdate,
        position: form.position || undefined,
        parentName: form.parentName || undefined,
        parentEmail: form.parentEmail || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/teams/${teamId}/players`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? strings.players.errorCreate);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(`/teams/${teamId}/players`)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm mb-4"
        >
          ← {team ? team.name : strings.players.playersFallback}
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{strings.players.createTitle}</h1>
        {team && (
          <p className="text-sm text-gray-500 mb-6">{team.name} · {team.category}</p>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {strings.players.successCreate}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.players.nameLabel}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.players.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.players.birthdateLabel}
            </label>
            <input
              type="date"
              required
              value={form.birthdate}
              onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.players.positionLabel}
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.players.positionPlaceholder}
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
              {strings.players.guardianSection}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{strings.players.guardianNameLabel}</label>
                <input
                  type="text"
                  value={form.parentName}
                  onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{strings.players.guardianEmailLabel}</label>
                <input
                  type="email"
                  value={form.parentEmail}
                  onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? strings.common.saving : strings.players.addPlayerButton}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-md text-sm transition-colors"
            >
              {strings.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
