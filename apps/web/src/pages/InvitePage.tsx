import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { invitationsApi } from '../api/invitations.api';
import { strings } from '../lib/strings';

const ROLES = ['DIRECTOR', 'COACH', 'PARENT'];

export default function InvitePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', role: 'COACH' });
  const [success, setSuccess] = useState(false);

  const { mutate: sendInvite, isPending, error } = useMutation({
    mutationFn: () => invitationsApi.create(form),
    onSuccess: () => {
      setSuccess(true);
      setForm({ email: '', role: 'COACH' });
    },
  });

  const errorMsg = error ? ((error as any)?.response?.data?.message ?? strings.invitations.errorSend) : '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendInvite();
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{strings.invitations.heading}</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {strings.invitations.successSend}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.invitations.emailLabel}
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.invitations.emailPlaceholder}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.invitations.roleLabel}</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {isPending ? strings.common.sending : strings.invitations.sendButton}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
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
