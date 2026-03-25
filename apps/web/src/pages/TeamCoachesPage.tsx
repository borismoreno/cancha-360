import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { teamCoachesApi } from '../api/teamCoaches.api';
import { useAuth } from '../hooks/useAuth';
import type { TeamCoach } from '../types/teamCoach';

export default function TeamCoachesPage() {
  const { teamId } = useParams();
  const { isDirector } = useAuth();

  const [coaches, setCoaches] = useState<TeamCoach[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [form, setForm] = useState({ userId: '', role: 'HEAD' as 'HEAD' | 'ASSISTANT' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  async function loadCoaches() {
    setListLoading(true);
    try {
      const res = await teamCoachesApi.list(Number(teamId));
      setCoaches(res.data);
    } catch (err: any) {
      setListError(err?.response?.data?.message ?? 'Error al cargar entrenadores');
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadCoaches();
  }, [teamId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      await teamCoachesApi.add(Number(teamId), {
        userId: Number(form.userId),
        role: form.role,
      });
      setForm({ userId: '', role: 'HEAD' });
      loadCoaches();
    } catch (err: any) {
      setAddError(err?.response?.data?.message ?? 'Error al agregar entrenador');
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemove(userId: number) {
    if (!confirm('¿Eliminar este entrenador del equipo?')) return;
    try {
      await teamCoachesApi.remove(Number(teamId), userId);
      setCoaches((prev) => prev.filter((c) => c.userId !== userId));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Error al eliminar');
    }
  }

  return (
    <Layout>
      <div className="max-w-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Entrenadores del Equipo</h1>
        <p className="text-sm text-gray-500 mb-6">Equipo ID: {teamId}</p>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Entrenadores actuales</h2>

          {listLoading && <p className="text-sm text-gray-400">Cargando...</p>}
          {listError && <p className="text-sm text-red-600">{listError}</p>}
          {!listLoading && coaches.length === 0 && !listError && (
            <p className="text-sm text-gray-400">No hay entrenadores asignados.</p>
          )}

          <ul className="space-y-2">
            {coaches.map((coach) => (
              <li
                key={coach.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {coach.user?.name ?? `Usuario #${coach.userId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {coach.role} · ID: {coach.userId}
                  </p>
                </div>
                {isDirector && (
                  <button
                    onClick={() => handleRemove(coach.userId)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add coach (DIRECTOR only) */}
        {isDirector && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Agregar Entrenador</h2>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {addError}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID del Usuario
                </label>
                <input
                  type="number"
                  required
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as 'HEAD' | 'ASSISTANT' })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="HEAD">Principal (HEAD)</option>
                  <option value="ASSISTANT">Asistente (ASSISTANT)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
              >
                {addLoading ? 'Agregando...' : 'Agregar'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
