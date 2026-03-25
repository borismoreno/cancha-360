import { http } from './http';
import type { CreateTeamRequest, Team } from '../types/team';

export const teamsApi = {
  list: (academyId: number) =>
    http.get<Team[]>(`/academies/${academyId}/teams`),

  create: (academyId: number, data: CreateTeamRequest) =>
    http.post(`/academies/${academyId}/teams`, data),
};
