import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { academiesApi } from '../api/academies.api';
import type { CreateAcademyRequest } from '../types/academy';
import { strings } from '../lib/strings';

const initial: CreateAcademyRequest = {
  name: '',
  country: '',
  city: '',
  directorName: '',
  directorEmail: '',
};

const fields: { label: string; field: keyof CreateAcademyRequest; type: string }[] = [
  { label: strings.academies.nameLabel, field: 'name', type: 'text' },
  { label: strings.academies.countryLabel, field: 'country', type: 'text' },
  { label: strings.academies.cityLabel, field: 'city', type: 'text' },
  { label: strings.academies.directorNameLabel, field: 'directorName', type: 'text' },
  { label: strings.academies.directorEmailLabel, field: 'directorEmail', type: 'email' },
];

export default function CreateAcademyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [success, setSuccess] = useState(false);

  const { mutate: createAcademy, isPending, error } = useMutation({
    mutationFn: () => academiesApi.create(form),
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    },
  });

  const errorMsg = error ? ((error as any)?.response?.data?.message ?? strings.academies.errorCreate) : '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAcademy();
  }

  return (
    <Layout>
      <div className="w-full max-w-lg">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{strings.academies.createTitle}</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {strings.academies.successCreate}
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
          {fields.map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                required
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {isPending ? strings.common.creating : strings.academies.createButton}
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
