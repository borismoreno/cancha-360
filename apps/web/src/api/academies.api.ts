import { http } from './http';
import type { CreateAcademyRequest } from '../types/academy';

export const academiesApi = {
  create: (data: CreateAcademyRequest) =>
    http.post('/admin/academies', data),
};
