import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { trainingsApi } from '../api/trainings.api';

export default function TrainingSessionPage() {
  const { sessionId } = useParams();

  const [attendance, setAttendance] = useState({
    playerId: '',
    status: 'PRESENT' as 'PRESENT' | 'ABSENT',
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');

  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');

  async function handleAttendance(e: React.FormEvent) {
    e.preventDefault();
    setAttendanceError('');
    setAttendanceLoading(true);
    try {
      await trainingsApi.recordAttendance(Number(sessionId), {
        playerId: Number(attendance.playerId),
        status: attendance.status,
      });
      setAttendanceSuccess(true);
      setAttendance({ playerId: '', status: 'PRESENT' });
      setTimeout(() => setAttendanceSuccess(false), 3000);
    } catch (err: any) {
      setAttendanceError(err?.response?.data?.message ?? 'Error al registrar asistencia');
    } finally {
      setAttendanceLoading(false);
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
    } catch (err: any) {
      setCancelError(err?.response?.data?.message ?? 'Error al cancelar sesión');
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-lg">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Sesión de Entrenamiento</h1>
        <p className="text-sm text-gray-500 mb-6">Sesión ID: {sessionId}</p>

        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Registrar Asistencia</h2>

          {attendanceSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              Asistencia registrada correctamente.
            </div>
          )}
          {attendanceError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {attendanceError}
            </div>
          )}

          <form onSubmit={handleAttendance} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Jugador
              </label>
              <input
                type="number"
                required
                value={attendance.playerId}
                onChange={(e) => setAttendance({ ...attendance, playerId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className="flex gap-3">
                {(['PRESENT', 'ABSENT'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAttendance({ ...attendance, status: s })}
                    className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                      attendance.status === s
                        ? s === 'PRESENT'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'PRESENT' ? 'Presente' : 'Ausente'}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={attendanceLoading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {attendanceLoading ? 'Guardando...' : 'Registrar'}
            </button>
          </form>
        </div>

        {/* Cancel session */}
        <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6">
          <h2 className="font-semibold text-red-700 mb-4">Cancelar Sesión</h2>

          {cancelSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              Sesión cancelada correctamente.
            </div>
          )}
          {cancelError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {cancelError}
            </div>
          )}

          <form onSubmit={handleCancel} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo (opcional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                disabled={cancelSuccess}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-50"
                placeholder="Ej: Lluvia, cancha ocupada..."
              />
            </div>
            <button
              type="submit"
              disabled={cancelLoading || cancelSuccess}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {cancelLoading ? 'Cancelando...' : 'Cancelar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
