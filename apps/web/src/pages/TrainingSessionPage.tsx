import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { trainingsApi } from '../api/trainings.api';
import type { SessionDetail, SessionPlayer } from '../types/training';
import { strings } from '../lib/strings';

export default function TrainingSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [savingPlayer, setSavingPlayer] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<Record<number, 'PRESENT' | 'ABSENT'>>({});

  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    trainingsApi
      .getSession(Number(sessionId))
      .then((res) => {
        setSession(res.data);
        const initial: Record<number, 'PRESENT' | 'ABSENT'> = {};
        res.data.players.forEach((p) => {
          if (p.attendanceStatus) initial[p.id] = p.attendanceStatus;
        });
        setAttendance(initial);
      })
      .catch((err) => setError(err?.response?.data?.message ?? strings.sessions.detail.errorLoading))
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function handleAttendance(player: SessionPlayer, status: 'PRESENT' | 'ABSENT') {
    setSavingPlayer(player.id);
    try {
      await trainingsApi.recordAttendance(Number(sessionId), {
        playerId: player.id,
        status,
      });
      setAttendance((prev) => ({ ...prev, [player.id]: status }));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Error al registrar asistencia');
    } finally {
      setSavingPlayer(null);
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setCancelError('');
    setCancelLoading(true);
    try {
      await trainingsApi.cancelSession(Number(sessionId), {
        reason: cancelReason || undefined,
      });
      setCancelSuccess(true);
      setSession((prev) => prev ? { ...prev, status: 'CANCELLED' } : prev);
    } catch (err: any) {
      setCancelError(err?.response?.data?.message ?? strings.sessions.detail.errorCancel);
    } finally {
      setCancelLoading(false);
    }
  }

  const isCancelled = session?.status === 'CANCELLED' || cancelSuccess;

  return (
    <Layout>
      <div className="w-full max-w-lg">
        {session && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(`/teams/${session.teamId}/sessions`)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ← {session.team?.name ?? strings.sessions.detail.sessionsFallback}
            </button>
          </div>
        )}

        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {strings.sessions.detail.title}
        </h1>
        {session && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              {new Date(session.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {session.team && (
              <p className="text-sm text-gray-500">{session.team.name} · {session.team.category}</p>
            )}
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              session.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' :
              session.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
              'bg-green-50 text-green-700'
            }`}>
              {strings.sessions.status[session.status] ?? session.status}
            </span>
          </div>
        )}

        {loading && <p className="text-sm text-gray-400">{strings.common.loading}</p>}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Attendance */}
        {session && !isCancelled && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              {strings.sessions.detail.attendanceHeading(session.players.length)}
            </h2>

            {session.players.length === 0 && (
              <p className="text-sm text-gray-400">{strings.sessions.detail.noPlayers}</p>
            )}

            <div className="space-y-3">
              {session.players.map((player) => {
                const current = attendance[player.id] ?? null;
                const isSaving = savingPlayer === player.id;

                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{player.name}</p>
                      {player.position && (
                        <p className="text-xs text-gray-400">{player.position}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAttendance(player, 'PRESENT')}
                        disabled={isSaving}
                        className={`py-2 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${
                          current === 'PRESENT'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                        }`}
                      >
                        {strings.sessions.detail.presentButton}
                      </button>
                      <button
                        onClick={() => handleAttendance(player, 'ABSENT')}
                        disabled={isSaving}
                        className={`py-2 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${
                          current === 'ABSENT'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        {strings.sessions.detail.absentButton}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancel session */}
        {session && !isCancelled && (
          <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6">
            <h2 className="font-semibold text-red-700 mb-4">{strings.sessions.detail.cancelSection}</h2>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings.sessions.detail.cancelReasonLabel}
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder={strings.sessions.detail.cancelReasonPlaceholder}
                />
              </div>
              <button
                type="submit"
                disabled={cancelLoading}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
              >
                {cancelLoading ? strings.sessions.detail.cancelling : strings.sessions.detail.cancelButton}
              </button>
            </form>
          </div>
        )}

        {isCancelled && session && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {strings.sessions.detail.cancelledMessage}
          </div>
        )}
      </div>
    </Layout>
  );
}
