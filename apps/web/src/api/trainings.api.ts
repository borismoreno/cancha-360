import { http } from './http';
import type {
  CreateTrainingScheduleRequest,
  AttendanceRequest,
  CancelSessionRequest,
  TrainingSession,
  SessionDetail,
} from '../types/training';

export const trainingsApi = {
  listSessions: (teamId: number) =>
    http.get<TrainingSession[]>(`/teams/${teamId}/sessions`),

  getSession: (sessionId: number) =>
    http.get<SessionDetail>(`/training-sessions/${sessionId}`),

  createSchedule: (teamId: number, data: CreateTrainingScheduleRequest) =>
    http.post(`/teams/${teamId}/training-schedules`, data),

  cancelSession: (sessionId: number, data: CancelSessionRequest) =>
    http.patch(`/training-sessions/${sessionId}/cancel`, data),

  recordAttendance: (sessionId: number, data: AttendanceRequest) =>
    http.post(`/training-sessions/${sessionId}/attendance`, data),
};
