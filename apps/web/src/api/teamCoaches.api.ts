import { http } from './http';
import type { AddTeamCoachRequest, TeamCoach } from '../types/teamCoach';

export const teamCoachesApi = {
  add: (teamId: number, data: AddTeamCoachRequest) =>
    http.post(`/teams/${teamId}/coaches`, data),

  list: (teamId: number) =>
    http.get<TeamCoach[]>(`/teams/${teamId}/coaches`),

  remove: (teamId: number, userId: number) =>
    http.delete(`/teams/${teamId}/coaches/${userId}`),
};
