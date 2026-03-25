import { http } from './http';
import type { CreatePlayerRequest, Player, PlayerProgress } from '../types/player';

export const playersApi = {
  list: (teamId: number) =>
    http.get<Player[]>(`/teams/${teamId}/players`),

  create: (teamId: number, data: CreatePlayerRequest) =>
    http.post(`/teams/${teamId}/players`, data),

  getProgress: (playerId: number) =>
    http.get<PlayerProgress>(`/players/${playerId}/progress`),
};
