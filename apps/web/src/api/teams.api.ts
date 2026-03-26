import { http } from './http';
import type { CreateTeamRequest, Team } from '../types/team';

export const teamsApi = {
  list: () =>
    http.get<Team[]>('/teams'),

  getOne: (teamId: number) =>
    http.get<Team>(`/teams/${teamId}`),

  create: (academyId: number, data: CreateTeamRequest) =>
    http.post(`/academies/${academyId}/teams`, data),
};
