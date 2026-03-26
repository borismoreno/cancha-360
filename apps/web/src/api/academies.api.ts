import { http } from './http';
import type { CreateAcademyRequest, Academy, AcademyMember } from '../types/academy';

export const academiesApi = {
  create: (data: CreateAcademyRequest) =>
    http.post('/admin/academies', data),

  getCurrent: () =>
    http.get<Academy>('/academies/current'),

  getMembers: (role?: string) =>
    http.get<AcademyMember[]>('/academies/members', { params: role ? { role } : {} }),
};
