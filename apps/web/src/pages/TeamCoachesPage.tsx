import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { teamCoachesApi } from '../api/teamCoaches.api';
import { academiesApi } from '../api/academies.api';
import { useAuth } from '../hooks/useAuth';
import { strings } from '../lib/strings';

export default function TeamCoachesPage() {
  const { teamId } = useParams();
  const { isDirector } = useAuth();
  const queryClient = useQueryClient();
  const id = Number(teamId);

  const [form, setForm] = useState({ userId: '', role: 'HEAD' as 'HEAD' | 'ASSISTANT' });

  const { data: coaches = [], isLoading: listLoading, isError: listError, error: listErrorObj } = useQuery({
    queryKey: ['coaches', id],
    queryFn: () => teamCoachesApi.list(id).then((r) => r.data),
    enabled: !!teamId,
  });

  const { data: availableCoaches = [] } = useQuery({
    queryKey: ['academy-members', 'COACH'],
    queryFn: () => academiesApi.getMembers('COACH').then((r) => r.data),
    enabled: isDirector,
  });

  const { mutate: addCoach, isPending: addLoading, error: addErrorObj } = useMutation({
    mutationFn: () =>
      teamCoachesApi.add(id, { userId: Number(form.userId), role: form.role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', id] });
      setForm({ userId: '', role: 'HEAD' });
    },
  });

  const { mutate: removeCoach } = useMutation({
    mutationFn: (userId: number) => teamCoachesApi.remove(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', id] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message ?? strings.coaches.errorRemove);
    },
  });

  const listErrorMsg = listError ? ((listErrorObj as any)?.response?.data?.message ?? strings.coaches.errorLoad) : '';
  const addErrorMsg = addErrorObj ? ((addErrorObj as any)?.response?.data?.message ?? strings.coaches.errorAdd) : '';

  const assignedIds = new Set(coaches.map((c) => c.userId));
  const unassigned = availableCoaches.filter((m) => !assignedIds.has(m.userId));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.userId) return;
    addCoach();
  }

  function handleRemove(userId: number) {
    if (!confirm(strings.coaches.removeConfirm)) return;
    removeCoach(userId);
  }

  return (
    <Layout>
      <div className="w-full max-w-lg">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {strings.coaches.heading}
        </h1>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">{strings.coaches.currentSection}</h2>

          {listLoading && <p className="text-sm text-gray-400">{strings.common.loading}</p>}
          {listErrorMsg && <p className="text-sm text-red-600">{listErrorMsg}</p>}
          {!listLoading && coaches.length === 0 && !listErrorMsg && (
            <p className="text-sm text-gray-400">{strings.coaches.empty}</p>
          )}

          <ul className="space-y-2">
            {coaches.map((coach) => (
              <li
                key={coach.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {coach.user?.name ?? strings.coaches.coachFallback}
                  </p>
                  <p className="text-xs text-gray-500">
                    {coach.user?.email ?? ''} · {strings.coaches.roleLabels[coach.role] ?? coach.role}
                  </p>
                </div>
                {isDirector && (
                  <button
                    onClick={() => handleRemove(coach.userId)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors shrink-0 py-1 px-2"
                  >
                    {strings.coaches.removeButton}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add coach (DIRECTOR only) */}
        {isDirector && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="font-semibold text-gray-800 mb-4">{strings.coaches.addSection}</h2>

            {addErrorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {addErrorMsg}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings.coaches.selectLabel}
                </label>
                {unassigned.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    {strings.coaches.noAvailable}
                  </p>
                ) : (
                  <select
                    required
                    value={form.userId}
                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">{strings.coaches.selectPlaceholder}</option>
                    {unassigned.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {unassigned.length > 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{strings.coaches.roleLabel}</label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value as 'HEAD' | 'ASSISTANT' })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="HEAD">{strings.coaches.roleLabels['HEAD']}</option>
                      <option value="ASSISTANT">{strings.coaches.roleLabels['ASSISTANT']}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={addLoading || !form.userId}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
                  >
                    {addLoading ? strings.coaches.adding : strings.coaches.addButton}
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
