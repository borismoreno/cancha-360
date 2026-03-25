import { http } from './http';
import type { CreateEvaluationRequest } from '../types/evaluation';

export const evaluationsApi = {
  create: (playerId: number, data: CreateEvaluationRequest) =>
    http.post(`/players/${playerId}/evaluations`, data),
};
