import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import type { AcademyMembership } from '../types/auth';

export default function SelectAcademyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const memberships: AcademyMembership[] = location.state?.memberships ?? [];
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSelect(academyId: number) {
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.selectAcademy({ academyId });
      localStorage.setItem('token', data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al seleccionar academia');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Selecciona una academia</h1>
        <p className="text-sm text-gray-500 mb-6">Tienes acceso a múltiples academias.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {memberships.length === 0 && (
          <p className="text-sm text-gray-400">No hay academias disponibles.</p>
        )}

        <div className="space-y-3">
          {memberships.map((m) => (
            <button
              key={m.academyId}
              onClick={() => handleSelect(m.academyId)}
              disabled={loading}
              className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <p className="font-medium text-gray-800">{m.academyName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
