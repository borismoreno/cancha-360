import { http } from './http';
import type { CreatePlayerRequest, PlayerProgress } from '../types/player';

export const playersApi = {
  create: (teamId: number, data: CreatePlayerRequest) =>
    http.post(`/teams/${teamId}/players`, data),

  getProgress: (playerId: number) =>
    http.get<PlayerProgress>(`/players/${playerId}/progress`),
};
