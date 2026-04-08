import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { academiesApi } from '../api/academies.api';
import { parseJwt } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';
import type { AcademyMembership } from '../types/auth';
import { strings } from '../lib/strings';

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
      const user = parseJwt(data.accessToken);
      let academy = null;
      if (user?.academyId) {
        try {
          const res = await academiesApi.getCurrent();
          academy = res.data;
        } catch {}
      }
      useAuthStore.getState().setSession(user, academy, data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? strings.academies.errorSelect);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{strings.academies.selectTitle}</h1>
        <p className="text-sm text-gray-500 mb-6">{strings.academies.selectDescription}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {memberships.length === 0 && (
          <p className="text-sm text-gray-400">{strings.academies.noAcademies}</p>
        )}

        <div className="space-y-3">
          {memberships.map((m) => (
            <button
              key={m.academyId}
              onClick={() => handleSelect(m.academyId)}
              disabled={loading}
              className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <p className="font-medium text-gray-800 text-base">{m.academyName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
