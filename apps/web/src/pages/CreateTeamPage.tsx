import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { teamsApi } from '../api/teams.api';
import { useAuth } from '../hooks/useAuth';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', category: '' });
  const [academyId, setAcademyId] = useState(user?.academyId?.toString() ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await teamsApi.create(Number(academyId), form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear equipo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Crear Equipo</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Equipo creado exitosamente. Redirigiendo...
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          {user?.role === 'SUPER_ADMIN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de Academia
              </label>
              <input
                type="number"
                required
                value={academyId}
                onChange={(e) => setAcademyId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del equipo
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Tigres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Sub-15"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Equipo'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
