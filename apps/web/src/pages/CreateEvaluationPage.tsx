import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { evaluationsApi } from '../api/evaluations.api';
import type { CreateEvaluationRequest } from '../types/evaluation';

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-indigo-600 w-8 text-right">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

const initial: CreateEvaluationRequest = {
  technicalScore: 5,
  tacticalScore: 5,
  physicalScore: 5,
  attitudeScore: 5,
  notes: '',
};

export default function CreateEvaluationPage() {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function setScore(field: keyof CreateEvaluationRequest, value: number | string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await evaluationsApi.create(Number(playerId), {
        technicalScore: form.technicalScore,
        tacticalScore: form.tacticalScore,
        physicalScore: form.physicalScore,
        attitudeScore: form.attitudeScore,
        notes: form.notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/players/${playerId}/progress`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al registrar evaluación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Nueva Evaluación</h1>
        <p className="text-sm text-gray-500 mb-6">Jugador ID: {playerId}</p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Evaluación guardada. Redirigiendo al progreso...
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
        >
          <ScoreSlider
            label="Puntaje Técnico"
            value={form.technicalScore}
            onChange={(v) => setScore('technicalScore', v)}
          />
          <ScoreSlider
            label="Puntaje Táctico"
            value={form.tacticalScore}
            onChange={(v) => setScore('tacticalScore', v)}
          />
          <ScoreSlider
            label="Puntaje Físico"
            value={form.physicalScore}
            onChange={(v) => setScore('physicalScore', v)}
          />
          <ScoreSlider
            label="Puntaje de Actitud"
            value={form.attitudeScore}
            onChange={(v) => setScore('attitudeScore', v)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setScore('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Observaciones del entrenador..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Evaluación'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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
