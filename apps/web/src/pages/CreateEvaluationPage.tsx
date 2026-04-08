import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { evaluationsApi } from '../api/evaluations.api';
import { playersApi } from '../api/players.api';
import type { CreateEvaluationRequest } from '../types/evaluation';
import { strings } from '../lib/strings';

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
        className="w-full accent-indigo-600 h-2"
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
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initial);
  const [success, setSuccess] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['player-progress', Number(playerId)],
    queryFn: () => playersApi.getProgress(Number(playerId)).then((r) => r.data),
    enabled: !!playerId,
  });

  const { mutate: createEvaluation, isPending, error } = useMutation({
    mutationFn: () =>
      evaluationsApi.create(Number(playerId), {
        technicalScore: form.technicalScore,
        tacticalScore: form.tacticalScore,
        physicalScore: form.physicalScore,
        attitudeScore: form.attitudeScore,
        notes: form.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-progress', Number(playerId)] });
      setSuccess(true);
      setTimeout(() => navigate(`/players/${playerId}/progress`), 1500);
    },
  });

  const errorMsg = error ? ((error as any)?.response?.data?.message ?? strings.evaluations.errorSave) : '';

  function setScore(field: keyof CreateEvaluationRequest, value: number | string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createEvaluation();
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm mb-4"
        >
          {strings.common.back}
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{strings.evaluations.createTitle}</h1>
        {progress?.player?.name && (
          <p className="text-sm font-medium text-indigo-600 mb-6">{progress.player.name}</p>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {strings.evaluations.successSave}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-5"
        >
          <ScoreSlider
            label={strings.evaluations.technicalLabel}
            value={form.technicalScore}
            onChange={(v) => setScore('technicalScore', v)}
          />
          <ScoreSlider
            label={strings.evaluations.tacticalLabel}
            value={form.tacticalScore}
            onChange={(v) => setScore('tacticalScore', v)}
          />
          <ScoreSlider
            label={strings.evaluations.physicalLabel}
            value={form.physicalScore}
            onChange={(v) => setScore('physicalScore', v)}
          />
          <ScoreSlider
            label={strings.evaluations.attitudeLabel}
            value={form.attitudeScore}
            onChange={(v) => setScore('attitudeScore', v)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.evaluations.notesLabel}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setScore('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder={strings.evaluations.notesPlaceholder}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {isPending ? strings.common.saving : strings.evaluations.saveButton}
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
