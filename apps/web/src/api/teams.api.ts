import { http } from './http';
import type { CreateTeamRequest } from '../types/team';

export const teamsApi = {
  create: (academyId: number, data: CreateTeamRequest) =>
    http.post(`/academies/${academyId}/teams`, data),
};
