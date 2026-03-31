import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { strings } from '../lib/strings';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });

      if (data.requiresAcademySelection && data.tempToken) {
        localStorage.setItem('token', data.tempToken);
        navigate('/select-academy', { state: { memberships: data.memberships } });
        return;
      }

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? strings.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{strings.auth.loginTitle}</h1>
        <p className="text-sm text-gray-500 mb-6">{strings.auth.loginSubtitle}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.auth.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.auth.emailPlaceholder}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.auth.passwordLabel}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.auth.passwordPlaceholder}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md text-base disabled:opacity-50 transition-colors"
          >
            {loading ? strings.auth.loggingIn : strings.auth.loginButton}
          </button>
        </form>

        <p className="mt-5 text-xs text-center text-gray-400">
          {strings.auth.invitationPrompt}{' '}
          <a href="/accept-invitation" className="text-indigo-600 hover:underline">
            {strings.auth.activateLink}
          </a>
        </p>
      </div>
    </div>
  );
}
